import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { toast } from "@/components/ui/toast";

interface ShareSnippetDialogProps {
  open?: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
}

export default function ShareSnippetDialog({
  open,
  onClose,
}: ShareSnippetDialogProps) {
  const { language, getCode } = useCodeEditorStore();
  const createSnippet = ""

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
    },
  });

  const handleShare = async (data: FormData) => {
    try {
      const code = getCode();
    //   await createSnippet({
    //     title: data.title,
    //     language,
    //     code,
    //   });

      // toast.add({
      //   title: "Success",
      //   description: "Snippet shared successfully",
      //   type: "success",
      // });
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating snippet:", error);
      // toast.add({
      //   title: "Error",
      //   description: "Error creating snippet",
      //   type: "error",
      // });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog   open={open} onOpenChange={handleOpenChange} >
      <DialogContent className="sm:max-w-md bg-[#1e1e2e] border-[#313244] text-white">
        <DialogHeader >
          <DialogTitle className="text-xl font-semibold text-white">
            Share Snippet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Give your code snippet a title before sharing it with others.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleShare)}>
          <FieldGroup className="mb-6">
            <Field>
              <Label htmlFor="title" className="text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter snippet title"
                className="bg-[#181825] border-[#313244] text-white focus:ring-blue-500"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.title.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="flex justify-end gap-3 sm:max-w-md bg-[#1e1e2e] border-[#313244]">
            <DialogClose >
              <Button
                type="button"
                variant="ghost"
                className="border-[#313244] text-gray-400 hover:bg-[#181825] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}