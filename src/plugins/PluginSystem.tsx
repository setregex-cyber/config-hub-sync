import React from 'react';
import { Plugin } from '../types/regex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PluginSystemProps {
  plugins: Plugin[];
  pattern: string;
  flags: string;
  testString: string;
}

export const PluginSystem: React.FC<PluginSystemProps> = ({
  plugins,
  pattern,
  flags,
  testString
}) => {
  if (plugins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plugins</CardTitle>
          <CardDescription>No plugins loaded</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plugins</CardTitle>
        <CardDescription>Additional regex analysis tools</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={plugins[0]?.id} className="space-y-4">
          <TabsList className="grid w-full grid-cols-1">
            {plugins.map((plugin) => (
              <TabsTrigger key={plugin.id} value={plugin.id}>
                {plugin.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {plugins.map((plugin) => (
            <TabsContent key={plugin.id} value={plugin.id} className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                {plugin.description}
              </div>
              <plugin.component 
                pattern={pattern} 
                flags={flags} 
                testString={testString} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};