"use client";

import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface ResizableEditorLayoutProps {
  editor: ReactNode;
  output: ReactNode;
}

export default function ResizableEditorLayout({
  editor,
  output,
}: ResizableEditorLayoutProps) {
  return (
    <>
      {/* Resizable Layout for Desktop / Laptop Screens */}
      <div className="hidden lg:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-150 rounded-xl"
        >
          <ResizablePanel defaultSize={50} minSize={30}>
            {editor}
          </ResizablePanel>

          <ResizableHandle withHandle className="mx-2" />

          <ResizablePanel defaultSize={50} minSize={25}>
            {output}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Fallback Stacked Layout for Mobile Screens */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {editor}
        {output}
      </div>
    </>
  );
}
