/**
 * Step 6 Test - UI Components
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step6Test() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Step 6: Core UI Components</h1>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <Label htmlFor="test-input">Test Input</Label>
          <Input id="test-input" placeholder="Test the input component" />
          <Button variant="emergency">Emergency Button</Button>
          <Button variant="success">Success Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}