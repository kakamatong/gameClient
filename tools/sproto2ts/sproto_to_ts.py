#!/usr/bin/env python3
"""
sproto to TypeScript 类型定义转换器
将sproto协议文件转换为TypeScript类型定义
每个sproto文件对应生成一个ts文件，保留注释
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
        self.element_comments = {}  # 存储元素注释 {element_name: comment}
        self.line_to_element = {}  # 存储行号到元素的映射 {line_num: element_name}
        
    def parse_file(self, file_path: str) -> Dict:
        """解析单个sproto文件"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取注释和关联到元素
        self.extract_element_comments(content)
        
        # 移除注释后解析内容
        content_no_comments = re.sub(r'#.*$', '', content, flags=re.MULTILINE)
        
        self.current_file = file_path
        self.parse_content(content_no_comments)
        
        return {
            'types': self.types,
            'protocols': self.protocols,
            'element_comments': self.element_comments
        }
    
    def extract_element_comments(self, content: str):
        """提取注释并关联到相应的协议或类型定义"""
        lines = content.split('\n')
        pending_comment = None
        
        for i, line in enumerate(lines):
            stripped_line = line.strip()
            
            if stripped_line.startswith('#'):
                # 这是一个注释行，保存它等待下一个元素
                comment_text = stripped_line[1:].strip()  # 移除#号并去除空格
                pending_comment = comment_text
            elif stripped_line and pending_comment:
                # 这是一个非空行，且前面有待关联的注释
                # 检查是否是类型或协议定义
                type_match = re.match(r'^\.([A-Za-z_][A-Za-z0-9_]*)\s*\{', stripped_line)
                protocol_match = re.match(r'^([A-Za-z_][A-Za-z0-9_]*)\s+\d+\s*\{', stripped_line)
                
                if type_match:
                    element_name = type_match.group(1)
                    self.element_comments[element_name] = pending_comment
                    pending_comment = None
                elif protocol_match:
                    element_name = protocol_match.group(1)
                    self.element_comments[element_name] = pending_comment
                    pending_comment = None
                # 如果不是类型或协议定义，保留pending_comment直到找到合适的元素
    
    def parse_content(self, content: str):
        """解析sproto内容"""
        # 解析类型定义 (.TypeName { ... })
        type_pattern = r'\.([A-Za-z_]\w*)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
        for match in re.finditer(type_pattern, content):
            type_name = match.group(1)
            fields_content = match.group(2)
            
            fields = self.parse_fields(fields_content)
            self.types[type_name] = fields
            
        # 解析协议定义 (protocolName tagNumber { ... }) - 使用手动方法解析嵌套大括号
        # 先找到所有协议定义
        protocol_start_pattern = r'([A-Za-z_]\w+)\s+(\d+)\s*\{'
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
        field_pattern = r'([A-Za-z_]\w+)\s+(\d+)\s*:\s*(\*?[A-Za-z_]\w+(?:\.[A-Za-z_]\w+)?)'
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
        self.element_comments = {}
        
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
        self.element_comments = sproto_data.get('element_comments', {})
    
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
        
        # 使用专门针对此元素的注释，如果没有则使用传入的注释
        element_specific_comment = self.element_comments.get(name, comment)
        if element_specific_comment:
            lines.append(f'/** {element_specific_comment} */')
        
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
                # 使用协议名称作为注释，如果有特定注释则使用特定注释
                comment = self.element_comments.get(proto_name, f"{proto_name} 协议请求参数")
                lines.append(self.generate_ts_interface(
                    request_interface, 
                    proto_def['request'], 
                    f"{comment} - 请求参数"
                ))
            
            # 生成响应接口
            if 'response' in proto_def and proto_def['response']:
                response_interface = f'{proto_name.capitalize()}Response'
                comment = self.element_comments.get(proto_name, f"{proto_name} 协议响应参数")
                lines.append(self.generate_ts_interface(
                    response_interface, 
                    proto_def['response'], 
                    f"{comment} - 响应参数"
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
        
        return '\n'.join(lines)


def convert_single_sproto_to_ts(input_file_path: str, output_dir: str, input_base_dir: str = None):
    """转换单个sproto文件为对应的TypeScript类型定义文件"""
    parser = SprotoParser()
    generator = TsGenerator()
    
    # 解析单个sproto文件
    data = parser.parse_file(input_file_path)
    
    # 设置解析后的数据给生成器
    generator.set_sproto_data(data)
    
    # 生成TypeScript代码
    ts_code = generator.generate_all_types()
    
    # 生成输出文件路径，保持相对路径结构
    if input_base_dir:
        # 保留原始目录结构
        rel_path_from_input_dir = os.path.relpath(input_file_path, start=input_base_dir)
    else:
        # 如果没有指定输入基础目录，则使用输入文件的目录
        input_base_dir = os.path.dirname(input_file_path)
        rel_path_from_input_dir = os.path.basename(input_file_path)
    
    # 替换文件扩展名
    ts_filename = os.path.splitext(rel_path_from_input_dir)[0] + '.ts'
    output_file_path = os.path.join(output_dir, ts_filename)
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
    
    # 写入输出文件
    with open(output_file_path, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Generated TypeScript types from {input_file_path} to {output_file_path}")
    print(f"Processed {len(data['types'])} types and {len(data['protocols'])} protocols")
    
    return output_file_path

def convert_sproto_directory(input_dir: str, output_dir: str):
    """转换指定目录下的所有sproto文件为对应的TypeScript类型定义文件"""
    
    # 遍历输入目录，查找所有.sproto文件
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith('.sproto'):
                file_path = os.path.join(root, file)
                print(f"Processing {file_path}")
                
                # 转换单个文件
                convert_single_sproto_to_ts(file_path, output_dir, input_dir)


def main():
    if len(sys.argv) < 3:
        print("Usage: python sproto_to_ts.py <input_directory_or_file> <output_directory>")
        print("Example: python sproto_to_ts.py ./assets/protocol ./types/")
        print("Example: python sproto_to_ts.py ./assets/protocol/lobby/c2s.sproto ./types/")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    if os.path.isfile(input_path):
        # 如果输入是单个文件
        input_base_dir = os.path.dirname(input_path)
        convert_single_sproto_to_ts(input_path, output_dir, input_base_dir)
    elif os.path.isdir(input_path):
        # 如果输入是目录
        convert_sproto_directory(input_path, output_dir)
    else:
        print(f"Error: {input_path} is neither a file nor a directory")
        sys.exit(1)


if __name__ == "__main__":
    main()