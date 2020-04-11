
source clients/python/venv/bin/activate;
export PROJECT_ALIAS="treehaus"

# alias cdm="${PROJECT_ALIAS}; cd apps/mobile";
alias cdb="${PROJECT_ALIAS}; cd server";

# alias sm="${PROJECT_ALIAS}; cd apps/mobile; expo start --ios";
alias sb="${PROJECT_ALIAS}; cd server; cargo run";
alias fenv="cdb; source flush_env.sh";

