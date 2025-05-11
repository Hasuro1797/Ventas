/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { es } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface Comment {
  text: string;
  date: Date;
}

interface CommentSectionProps {
  onDirtyChange?: (dirty: boolean) => void;
}

export default function CommentSection({ onDirtyChange }: CommentSectionProps) {
  const [addComment, setAddComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentDate, setCommentDate] = useState(new Date());

  const { control, setValue, getValues } = useFormContext();
  const comments: Comment[] =
    useWatch({
      control,
      name: "clientInfo.comments",
    }) || [];

  const defaultComments = useMemo(() => comments, []);

  const isCommentDirty = useMemo(() => {
    return JSON.stringify(comments) !== JSON.stringify(defaultComments);
  }, [comments, defaultComments]);

  useEffect(() => {
    onDirtyChange?.(isCommentDirty);
  }, [isCommentDirty]);

  const ensuredClientInfo = () => {
    const current = getValues("clientInfo");
    if (!current) {
      setValue("clientInfo", {});
    }
  };
  const handleAddComment = () => {
    const updated = [...comments, { text: commentText, date: commentDate }];
    ensuredClientInfo();
    setValue("clientInfo.comments", updated, { shouldDirty: true });
    setCommentText("");
    setCommentDate(new Date());
    setAddComment(false);
  };

  const handleDeleteComment = React.useCallback(
    (index: number) => {
      const updated = comments.filter((_, i) => i !== index);
      setValue("clientInfo.comments", updated, { shouldDirty: true });
    },
    [comments, setValue]
  );

  const renderComments = useMemo(() => {
    if (comments.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">No hay comentarios</div>
      );
    }

    return comments.map((comment, index) => (
      <div
        key={index}
        className="flex justify-between relative items-center border-b py-2"
      >
        <div className="flex gap-2">
          <div>
            <ImageIcon className="size-5 shrink text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm">
              {format(comment.date, "dd MMM 'del' yyyy", { locale: es })}
            </h3>
            <p className="text-sm text-foreground w-full max-w-[88%]">
              {comment.text}
            </p>
          </div>
        </div>
        <Button
          variant={"ghost"}
          type="button"
          className="absolute top-0.5 right-0.5"
          onClick={() => handleDeleteComment(index)}
        >
          <Trash strokeWidth={2} className="size-4" />
        </Button>
      </div>
    ));
  }, [comments, handleDeleteComment]);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground font-semibold flex items-center justify-between">
        <span>Comentarios</span>
        <Button
          variant={"ghost"}
          className="!size-8"
          type="button"
          onClick={() => setAddComment(!addComment)}
          disabled={addComment}
        >
          <Plus strokeWidth={2} className="size-4" />
        </Button>
      </div>

      {renderComments}

      {addComment && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Fecha de Comentario</Label>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      "text-muted-foreground"
                    )}
                  >
                    {commentDate ? (
                      format(commentDate, "dd MMM 'del' yyyy", { locale: es })
                    ) : (
                      <span className="w-[280px]">Seleccione fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={commentDate}
                  onSelect={(value) => {
                    if (value) setCommentDate(value);
                  }}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="textComment">Comentario</Label>
            <Textarea
              placeholder="Escribe un comentario..."
              className="resize-none min-h-[100px]"
              maxLength={300}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              Máximo 300 carácteres
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              variant={"outline"}
              disabled={!commentText}
              type="button"
              className="text-sm"
              onClick={handleAddComment}
            >
              Agregar
            </Button>
            <Button
              variant={"destructive"}
              type="button"
              className="text-sm"
              onClick={() => {
                setCommentText("");
                setCommentDate(new Date());
                setAddComment(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <Separator />
    </div>
  );
}
