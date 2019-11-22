import argparse
import json
import logging
import os
import sys
from typing import Dict, Iterator, List

import requests
import yaml

logger = logging.getLogger(__name__)


class TemplateParser:

    def __init__(self,
                template_dir: str,
                environment: str,
                product: str,
                services: List[str]):
        """ setup TemplateParser """
        self.template_dir = template_dir
        self.environment = environment
        self.product = product
        self.services = services

        self.settings = self.get_settings()
    
    def run(self):
        """ apply templates for all services """
        for full_path in self.yaml_files():
            self.run_on_single_file(full_path)
    


    def run_on_single_file(self,
                      full_path: str,):
        """ apply template for """
        dirname = os.path.abspath(os.path.join(full_path, os.pardir))
        *_, service = os.path.split(dirname)
        
        if self.should_use_template(service):
            self.format(
                full_path=full_path,
                service_settings=self.get_service_settings(service)
            )
        else:
            os.remove(full_path)


    def format(self, full_path: str, service_settings: Dict[str, str]):
        """ replace all variables in YAML file with actual value """
        with open(full_path, 'r', encoding='utf-8') as f:
            data = f.read()

        with open(full_path, 'w') as f:
            for key, value in service_settings.items():
                data = data.replace("{{{}}}".format(key), str(value))
            f.write(data)
            logger.info(f'wrote settings file to {full_path}')
    
    def yaml_files(self) -> Iterator[str]:
        """ yield all files ending in .yaml """
        for root, _, files in os.walk(f'{self.template_dir}/services/service_templates'):
            for name in files:
                if name.endswith('yaml') or name.endswith('yml'):
                    yield os.path.join(root, name)

    def should_use_template(self, service: str):
        """ :returns: (bool) """
        has_environment = service in self.settings[self.environment]
        missing_service = self.services and service not in self.services
        return has_environment and not missing_service


    def get_settings(self):
        """ :return: (Dict, Dict) default settings, settings """
        with open(self.settings_file_path, 'r') as f:
            settings = yaml.load(f)

            if self.environment not in settings:
                raise ValueError(
                    f'Cannot find ENVIRONMENT "{self.environment}"'
                    f'in PRODUCT "{self.product}"'
                )
            
            return settings

    def get_service_settings(self, service: str):
        """ first use service settings, then fall back to defaults """
        return {
            **self.default_settings,
            **self.settings[self.environment][service]
        }
    
    @property
    def settings_file_path(self):
        """ get path to actual values for filling in templates """
        return f'{self.template_dir}/{self.product}.yaml'

    @property
    def default_settings(self):
        """ look up default settings for our environment """
        return self.settings[self.environment].get('default', {})


def get_argument_parser():
    """ :returns: (ArgumentParser) """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e", "--environment",
        type=str,
        required=True,
        help="Environment in target product to deploy"
    )
    parser.add_argument(
        "-p", "--product",
        type=str,
        required=True,
        help="Product to deploy"
    )
    parser.add_argument(
        "-t", "--template-dir",
        type=str,
        required=True,
        help="The directory of templates"
    )
    parser.add_argument(
        "-s", "--services",
        nargs='+',
        help="selected service to deploy, separated by space"
    )
    parser.add_argument('--log', default='INFO', help='Set log level')
    return parser

if __name__ == '__main__':
    arg_parser = get_argument_parser()
    args = arg_parser.parse_args()
    logging.basicConfig(level=args.log)
    template_parser = TemplateParser(
        environment=args.environment,
        product=args.product,
        template_dir=args.template_dir,
        services=args.services,
    )
    template_parser.run()
