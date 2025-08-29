# 投票解散功能协议设计文档

## 功能概述

为私人房间添加投票解散功能，允许玩家在游戏开始后发起投票解散房间，通过民主投票的方式决定是否解散房间。

## 功能需求

1. **发起条件**: 任何房间内玩家在游戏开始后都可以发起解散
2. **投票规则**: 
   - 超过60%的玩家同意 → 解散成功
   - 任何一个玩家拒绝 → 立即终止解散流程
3. **时间限制**: 120秒倒计时，超时则中止解散
4. **并发控制**: 解散流程进行中不允许再次发起
5. **功能隔离**: 不影响房间其他功能正常运行

## 协议设计

### 客户端到服务端协议 (C2S)

#### 1. 发起投票解散 - voteDisbandRoom (9)

```protobuf
voteDisbandRoom 9 {
    request {
        reason 0 : string  # 解散原因(可选)
    }
    response {
        code 0 : integer
        msg 1 : string
    }
}
```

**参数说明**:
- `reason`: 发起解散的原因，可选参数，用于向其他玩家说明解散原因
- `code`: 响应码，1=成功，0=失败
- `msg`: 响应消息

**可能的错误码**:
- 0: 发起失败
  - "游戏未开始，无法发起投票解散"
  - "当前有投票解散正在进行中"
  - "玩家不在房间中"
  - "非私人房间不支持投票解散"

#### 2. 投票解散响应 - voteDisbandResponse (10)

```protobuf
voteDisbandResponse 10 {
    request {
        voteId 0 : integer  # 投票ID
        agree 1 : integer   # 1:同意, 0:拒绝
    }
    response {
        code 0 : integer
        msg 1 : string
    }
}
```

**参数说明**:
- `voteId`: 投票ID，用于标识具体的投票流程
- `agree`: 投票选择，1=同意解散，0=拒绝解散
- `code`: 响应码，1=投票成功，0=投票失败
- `msg`: 响应消息

**可能的错误码**:
- 0: 投票失败
  - "投票ID无效"
  - "投票已结束"
  - "已经投过票"
  - "玩家不在房间中"

### 服务端到客户端协议 (S2C)

#### 1. 投票解散开始通知 - voteDisbandStart (14)

```protobuf
.VoteInfo {
    userid 0 : integer
    vote 1 : integer     # 1:同意, 0:拒绝, -1:未投票
}

voteDisbandStart 14 {
    request {
        voteId 0 : integer       # 投票ID
        initiator 1 : integer    # 发起人 userid
        reason 2 : string        # 解散原因
        timeLeft 3 : integer     # 剩余时间(秒)
        playerCount 4 : integer  # 房间总人数
        needAgreeCount 5 : integer # 需要同意人数(60%)
    }
}
```

**参数说明**:
- `voteId`: 唯一投票ID，用于标识本次投票流程
- `initiator`: 发起投票的玩家userid
- `reason`: 解散原因
- `timeLeft`: 剩余投票时间(秒)，初始值120
- `playerCount`: 房间总人数
- `needAgreeCount`: 需要的同意人数(60%向上取整)

#### 2. 投票状态更新 - voteDisbandUpdate (15)

```protobuf
voteDisbandUpdate 15 {
    request {
        voteId 0 : integer       # 投票ID
        votes 1 : *VoteInfo      # 投票状态列表
        agreeCount 2 : integer   # 当前同意人数
        refuseCount 3 : integer  # 当前拒绝人数
        timeLeft 4 : integer     # 剩余时间(秒)
    }
}
```

**参数说明**:
- `voteId`: 投票ID
- `votes`: 所有玩家的投票状态数组
- `agreeCount`: 当前同意解散的人数
- `refuseCount`: 当前拒绝解散的人数
- `timeLeft`: 剩余投票时间(秒)

**VoteInfo结构**:
- `userid`: 玩家ID
- `vote`: 投票状态，1=同意，0=拒绝，-1=未投票

#### 3. 投票解散结果 - voteDisbandResult (16)

```protobuf
voteDisbandResult 16 {
    request {
        voteId 0 : integer       # 投票ID
        result 1 : integer       # 结果: 1:解散成功, 0:解散失败
        reason 2 : string        # 结果原因
        agreeCount 3 : integer   # 最终同意人数
        refuseCount 4 : integer  # 最终拒绝人数
        votes 5 : *VoteInfo      # 最终投票状态
    }
}
```

**参数说明**:
- `voteId`: 投票ID
- `result`: 投票结果，1=解散成功，0=解散失败
- `reason`: 结果原因说明
- `agreeCount`: 最终同意人数
- `refuseCount`: 最终拒绝人数
- `votes`: 最终所有玩家的投票状态

**可能的结果原因**:
- 解散成功: "投票通过，房间解散"
- 解散失败: 
  - "有玩家拒绝，投票失败"
  - "投票超时，自动取消"
  - "同意人数不足60%"

## 协议交互流程

### 1. 发起投票解散流程

```
Client A                    Server                     Client B/C/D
   |                          |                           |
   |-- voteDisbandRoom ------>|                           |
   |<-- response(code=1) -----|                           |
   |                          |-- voteDisbandStart ------>|
   |<-- voteDisbandStart -----|                           |
   |                          |                           |
```

### 2. 投票过程

```
Client B                    Server                     Client A/C/D
   |                          |                           |
   |-- voteDisbandResponse -->|                           |
   |<-- response(code=1) -----|                           |
   |                          |-- voteDisbandUpdate ----->|
   |<-- voteDisbandUpdate ----|                           |
   |                          |                           |
```

### 3. 投票结束

```
Server                     Client A/B/C/D
   |                          |
   |-- voteDisbandResult ----->|
   |                          |
   |-- roomEnd (if success) -->|
   |                          |
```

## 业务逻辑规则

### 1. 发起投票条件检查
- 房间必须是私人房间
- 游戏状态必须是 START (游戏进行中)
- 当前没有进行中的投票解散流程
- 发起人必须在房间中

### 2. 投票规则
- 需要超过60%的玩家同意 (向上取整)
  - 2人房间: 需要2人同意 (100%)
  - 3人房间: 需要2人同意 (66.7%)
  - 4人房间: 需要3人同意 (75%)
- 任何一个玩家拒绝，立即结束投票，解散失败
- 发起人自动视为同意

### 3. 时间限制
- 投票总时长120秒
- 每秒广播一次时间更新
- 超时后自动取消投票

### 4. 状态管理
- 投票进行中，不允许发起新的投票
- 投票不影响游戏其他功能
- 投票期间玩家可以正常游戏操作

## 错误处理

### 1. 网络异常
- 玩家断线期间的投票自动视为未投票
- 玩家重连后可以继续参与投票

### 2. 并发冲突
- 同时发起投票，只允许第一个成功
- 投票期间的重复投票请求被拒绝

### 3. 状态异常
- 投票期间房间状态改变的处理
- 玩家离开房间的投票状态处理

## 扩展考虑

### 1. 可配置参数
- 投票通过的百分比阈值
- 投票时间限制
- 是否允许游戏开始前发起投票

### 2. 功能增强
- 投票历史记录
- 投票冷却时间
- 踢人投票功能

## 实现注意事项

1. **线程安全**: 投票状态的并发访问控制
2. **内存管理**: 投票结束后及时清理相关数据
3. **协议版本**: 确保客户端服务端协议版本一致
4. **日志记录**: 详细记录投票过程用于调试和统计
5. **性能优化**: 避免频繁的状态广播影响游戏性能