# Publication Type Configurator

The publication type configurator is used for simple type configuration using a graphical user interface. A configuration file of a publisher (tenant) can be imported and edited in the tool.
```mermaid

%%{
  init: {
    'theme': 'neutral'
  }
}%%

block-beta
block:domain["Domain 'Configuration'"]
pubType["Publication
Type"]
columns 3
space
configTool["Configurator
Tool"]
space:3
Config space termDB[("
Term
Database")]

end
Config-->configTool
termDB-->configTool
configTool-->pubType
```

The configuration tool can create/edit a JSON file that configures the publication types. This JSON file must be loaded into the publication types server.
