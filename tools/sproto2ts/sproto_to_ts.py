#!/usr/bin/env python3
"""
sproto to TypeScript 类型定义转换器
将sproto协议文件转换为TypeScript类型定义
"""

import re
import os
import sys
from typing import Dict, List, Optional, Tuple


class SprotoParser:
    """解析sproto协议文件"""
    
    def __init__(self):
        self.types = {}  # 存储类型定义
        self.protocols = {}  # 存储协议定义
        
    def parse_file(self, file_path: str) -> Dict:
        """解析单个sproto文件"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        self.current_file = file_path
        self.parse_content(content)
        
        return {
            'types': self.types,
            'protocols': self.protocols
        }
    
    def parse_content(self, content: str):
        """解析sproto内容"""
        # 移除注释
        content = re.sub(r'#.*$', '', content, flags=re.MULTILINE)
        
        # 解析类型定义 (.TypeName { ... })
        type_pattern = r'\.(\w+)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
        for match in re.finditer(type_pattern, content):
            type_name = match.group(1)
            fields_content = match.group(2)
            
            fields = self.parse_fields(fields_content)
            self.types[type_name] = fields
            
        # 解析协议定义 (protocolName tagNumber { ... }) - 使用手动方法解析嵌套大括号
        # 先找到所有协议定义
        protocol_start_pattern = r'(\w+)\s+(\d+)\s*\{'
        matches = list(re.finditer(protocol_start_pattern, content))
        
        for i, match in enumerate(matches):
            protocol_name = match.group(1)
            tag_number = int(match.group(2))
            start_pos = match.start()
            
            # 从匹配位置开始查找完整的大括号内容
            brace_start = content.find('{', match.end()-1)
            if brace_start == -1:
                continue
                
            # 找到匹配的右大括号
            bracket_count = 0
            pos = brace_start
            
            for j, char in enumerate(content[brace_start:], brace_start):
                if char == '{':
                    bracket_count += 1
                elif char == '}':
                    bracket_count -= 1
                    if bracket_count == 0:  # 找到了匹配的右大括号
                        protocol_content = content[brace_start+1:j]  # 不包含首尾大括号
                        
                        protocol_def = self.parse_protocol(protocol_content)
                        protocol_def['tag'] = tag_number
                        self.protocols[protocol_name] = protocol_def
                        break
    
    def parse_fields(self, content: str) -> List[Dict]:
        """解析字段定义"""
        fields = []
        # 匹配字段定义: name tagNumber : fieldType
        field_pattern = r'(\w+)\s+(\d+)\s*:\s*(\*?\w+(?:\.\w+)?)'
        for match in re.finditer(field_pattern, content):
            field_name = match.group(1)
            tag_number = int(match.group(2))
            field_type = match.group(3)
            
            is_array = field_type.startswith('*')
            if is_array:
                field_type = field_type[1:]
            
            field_info = {
                'name': field_name,
                'tag': tag_number,
                'type': field_type,
                'is_array': is_array
            }
            fields.append(field_info)
        
        # 按tag排序
        fields.sort(key=lambda x: x['tag'])
        return fields
    
    def parse_protocol(self, content: str) -> Dict:
        """解析协议定义"""
        protocol = {}
        
        # 更精确地查找request和response，处理嵌套的大括号
        request_match = self.find_bracket_content(content, 'request')
        response_match = self.find_bracket_content(content, 'response')
        
        if request_match:
            request_fields = self.parse_fields(request_match)
            protocol['request'] = request_fields
        
        if response_match:
            response_fields = self.parse_fields(response_match)
            protocol['response'] = response_fields
        
        return protocol
    
    def find_bracket_content(self, text: str, keyword: str) -> str:
        """
        在文本中查找特定关键词后面的大括号内容，正确处理嵌套结构
        使用词边界确保精确匹配
        """
        # 使用词边界来精确匹配关键词，允许后面紧跟 {
        pattern = rf'\b{keyword}\s*\{{'
        match = re.search(pattern, text)
        if not match:
            return None
        
        start_pos = match.end() - 1  # 找到第一个左大括号的位置
        
        # 找到对应的右大括号
        # 注意：因为我们已经定位到了第一个左大括号，所以计数从0开始（而不是1）
        # 当遇到第一个左大括号时，计数变为1
        # 当遇到对应的右大括号时，计数减1最终变成0
        bracket_count = 0
        
        for i, char in enumerate(text[start_pos:], start_pos):
            if char == '{':
                bracket_count += 1
            elif char == '}':
                bracket_count -= 1
                if bracket_count == 0:  # 找到了匹配的右大括号
                    result = text[start_pos+1:i]
                    return result  # 返回大括号内的内容（不含首尾大括号）
        
        return None  # 如果没找到匹配的右大括号


class TsGenerator:
    """生成TypeScript类型定义"""
    
    def __init__(self):
        self.sproto_types = {}
        self.sproto_protocols = {}
        
        # sproto类型到TypeScript类型的映射
        self.type_mapping = {
            'integer': 'number',
            'string': 'string',
            'boolean': 'boolean',
            'binary': 'Uint8Array'
        }
    
    def set_sproto_data(self, sproto_data: Dict):
        """设置sproto解析的数据"""
        self.sproto_types = sproto_data.get('types', {})
        self.sproto_protocols = sproto_data.get('protocols', {})
    
    def sproto_to_ts_type(self, sproto_type: str, is_array: bool = False) -> str:
        """将sproto类型转换为TypeScript类型"""
        ts_type = self.type_mapping.get(sproto_type.lower(), sproto_type)
        
        if is_array:
            if ts_type == 'Uint8Array':  # 特殊处理binary数组
                return 'Uint8Array[]'
            else:
                return f'{ts_type}[]'
        
        return ts_type
    
    def generate_ts_interface(self, name: str, fields: List[Dict], comment: str = "") -> str:
        """生成TypeScript接口定义"""
        lines = []
        
        if comment:
            lines.append(f'/** {comment} */')
        
        lines.append(f'export interface {name} {{')
        
        for field in fields:
            field_name = field['name']
            field_type = field['type']
            is_array = field.get('is_array', False)
            
            ts_type = self.sproto_to_ts_type(field_type, is_array)
            lines.append(f'    {field_name}: {ts_type};')
        
        lines.append('}')
        lines.append('')  # 空行分隔
        
        return '\n'.join(lines)
    
    def generate_protocol_interfaces(self) -> str:
        """生成协议相关的TypeScript接口"""
        lines = []
        
        # 生成协议请求和响应接口
        for proto_name, proto_def in self.sproto_protocols.items():
            # 生成请求接口
            if 'request' in proto_def and proto_def['request']:
                request_interface = f'{proto_name.capitalize()}Request'
                lines.append(self.generate_ts_interface(
                    request_interface, 
                    proto_def['request'], 
                    f"{proto_name} 协议请求参数"
                ))
            
            # 生成响应接口
            if 'response' in proto_def and proto_def['response']:
                response_interface = f'{proto_name.capitalize()}Response'
                lines.append(self.generate_ts_interface(
                    response_interface, 
                    proto_def['response'], 
                    f"{proto_name} 协议响应参数"
                ))
        
        return '\n'.join(lines)
    
    def generate_all_types(self) -> str:
        """生成所有类型定义"""
        lines = []
        
        # 添加文件头部注释
        lines.append('// Auto-generated from sproto files')
        lines.append('// Do not edit manually')
        lines.append('')
        
        # 生成基础类型
        for type_name, fields in self.sproto_types.items():
            lines.append(self.generate_ts_interface(
                type_name, 
                fields, 
                f"{type_name} 结构体定义"
            ))
        
        # 生成协议相关接口
        lines.append(self.generate_protocol_interfaces())
        
        # 生成协议映射表（用于类型安全的协议调用）
        if self.sproto_protocols:
            lines.append('// 协议类型映射')
            lines.append('export interface ProtocolMap {')
            for proto_name in self.sproto_protocols.keys():
                request_interface = f'{proto_name.capitalize()}Request'
                response_interface = f'{proto_name.capitalize()}Response'
                
                has_request = 'request' in self.sproto_protocols[proto_name] and self.sproto_protocols[proto_name]['request']
                has_response = 'response' in self.sproto_protocols[proto_name] and self.sproto_protocols[proto_name]['response']
                
                request_type = request_interface if has_request else 'never'
                response_type = response_interface if has_response else 'void'
                
                lines.append(f'    "{proto_name}": {{ request: {request_type}, response: {response_type} }};')
            lines.append('}')
            lines.append('')
        
        return '\n'.join(lines)


def convert_sproto_to_ts(input_dir: str, output_file: str):
    """转换指定目录下的所有sproto文件为TypeScript类型定义"""
    parser = SprotoParser()
    generator = TsGenerator()
    
    all_types = {}
    all_protocols = {}
    
    # 遍历输入目录，查找所有.sproto文件
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith('.sproto'):
                file_path = os.path.join(root, file)
                print(f"Parsing {file_path}")
                
                # 解析单个文件
                data = parser.parse_file(file_path)
                
                # 合并类型和协议定义
                all_types.update(data['types'])
                all_protocols.update(data['protocols'])
    
    # 设置解析后的数据给生成器
    combined_data = {
        'types': all_types,
        'protocols': all_protocols
    }
    
    generator.set_sproto_data(combined_data)
    
    # 生成TypeScript代码
    ts_code = generator.generate_all_types()
    
    # 写入输出文件
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Generated TypeScript types to {output_file}")
    print(f"Processed {len(all_types)} types and {len(all_protocols)} protocols")


def main():
    if len(sys.argv) < 3:
        print("Usage: python sproto_to_ts.py <input_directory> <output_file>")
        print("Example: python sproto_to_ts.py ./assets/protocol ./types/sproto-types.ts")
        sys.exit(1)
    
    input_dir = sys.argv[1]
    output_file = sys.argv[2]
    
    convert_sproto_to_ts(input_dir, output_file)


if __name__ == "__main__":
    main()