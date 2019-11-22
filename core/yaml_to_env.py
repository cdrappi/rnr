import argparse

import yaml

if __name__== '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--yaml-in', type=str)
    parser.add_argument('--env-out', type=str)
    args = parser.parse_args()

    with open(args.yaml_in, 'r') as f:
        settings = yaml.load(f)
    
    [container, *_] = settings['spec']['template']['spec']['containers']
    with open(args.env_out, 'w') as f:
        f.write('\n'.join(
            f'export {var["name"]}={var["value"]};' 
            for var in container['env'])
        )
