import argparse
import json
import logging
import os
import sys

import requests
import yaml


class TemplateParser:

    def inplace_change(self, filename, settings):
        with open(filename, 'r', encoding='utf-8') as f:
            data = f.read()

        with open(filename, 'w') as f:
            for key, value in settings.items():
                data = data.replace("{{{}}}".format(key), str(value))
            f.write(data)

    def run(self):
        parser = argparse.ArgumentParser()
        parser.add_argument(
            "-t",
            "--template-dir",
            type=str,
            required=True,
            help="The directory of templates")
        parser.add_argument(
            "-p",
            "--product",
            type=str,
            required=True,
            help="Product to deploy")
        parser.add_argument(
            "-e",
            "--environment",
            type=str,
            required=True,
            help="Environment in target product to deploy")
        parser.add_argument(
            '-s',
            "--services",
            nargs='+',
            help="selected service to deploy, separated by space")
        args = parser.parse_args()
        template_dir = '{}/service_templates'.format(args.template_dir)
        setting_file_path = '{}/{}.yaml'.format(args.template_dir,
                                                args.product)

        # Deal with default settings.
        default_settings = {}
        with open(setting_file_path, 'r') as f:
            settings = yaml.load(f)

            if args.environment not in settings:
                raise ValueError('Cannot find ENVIRONMENT: {} in PRODUCT: {}'.format(args.environment, args.product))
            # Load default from yaml first.
            if 'default' in settings[args.environment]:
                default_settings = settings[args.environment]['default']

        for root, _, files in os.walk(template_dir):
            for name in files:
                if not name.endswith('yaml') and not name.endswith('yml'):
                    continue

                full_path = os.path.join(root, name)
                dirname = os.path.abspath(os.path.join(full_path, os.pardir))
                *_, service = os.path.split(dirname)
                should_use_template = True
                if args.services and service not in args.services or service not in settings[args.environment]:
                    should_use_template = False
                
                if should_use_template:
                    service_settings = default_settings.copy()
                    for key, value in settings[args.environment][service].items():
                        service_settings[key] = value

                    self.inplace_change(full_path, service_settings)
                else:
                    os.remove(full_path)

if __name__ == '__main__':
    parser = TemplateParser()
    parser.run()
