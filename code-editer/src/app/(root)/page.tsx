import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";
import ResizableEditorLayout from "./_components/ResizableEditorLayout";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />
        <ResizableEditorLayout
          editor={<EditorPanel />}
          output={<OutputPanel />}
        />
      </div>
    </div>
  );
}
