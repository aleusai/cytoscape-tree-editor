#!/usr/bin/python3

'''
This module provides the basic classes to build nodes 
'''


class_list = {
    "Component1": "maroon", 
    "Component2": "cyan", 
    "Component3": "orange"
}


pipelines = {
        "pipeline0": ['Component1', 'Component2'], 
        "pipeline1": ['Component1', 'Component2', 'Component3'] }

defaults = {}

defaults["Component1"] = {
      "field_1": "component1_value1<pipeline_name>",
      "field_2": "<pipeline_name>",
      "field_3": "component1_value2<pipeline_name>"
}

defaults["Component2"] = {
      "field_1": "component2_value1<pipeline_name>",
      "field_2": "<pipeline_name>",
      "field_3": "component2_value2<pipeline_name>"
}

defaults["Component3"] = {
      "field_1": "component3_value1<pipeline_name>",
      "field_2": "<pipeline_name>",
      "field_3": "component3_value2<pipeline_name>"
}
