# Publication Type Configurator

The publication type configurator is used for simple type configuration using a graphical user interface. A configuration file of a publisher (tenant) can be imported and edited in the tool.
```mermaid

%%{
  init: {
    'theme': 'neutral'
  }
}%%

block-beta
columns 4
  pubType["Publication
Type"] space
block:scope:2
configTool["Tenant
Configurator
Tool"]
termsConfig["Terms
Configurator
Tool"]
end
space:6
block:outOfScope:2
Config["Config
file"]
termDB[("
Term
Database")]
end


Config--"save/load"-->configTool
configTool-->Config
termDB-->configTool
outOfScope--"configures"-->pubType
termsConfig-->termDB
termDB--"save/load"-->termsConfig



style scope stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
style outOfScope stroke:grey,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
```

${\color{red}----}$ Scope of this repository

${\color{grey}----}$ Out of scope (for the Publication Configuration Server see Repository [here](https://github.com/officialgazette/publication-configurator-server))

## Tenant configuration tool
The configuration tool can create/edit a JSON file that configures the publication types. This JSON file must be loaded into the publication types server.

## Terms configuration tool
