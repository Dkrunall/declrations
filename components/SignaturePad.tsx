"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface SignaturePadHandle {
  isEmpty: () => boolean;
  clear: () => void;
  toDataURL: (type?: string) => string;
}

interface Props {
  penColor?: string;
  backgroundColor?: string;
}

const SignaturePad = forwardRef<SignaturePadHandle, Props>(
  ({ penColor = "#C9913A", backgroundColor = "#111111" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const hasDrawn = useRef(false);

    const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

    const initCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = getCtx()!;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }, [backgroundColor]);

    useEffect(() => {
      initCanvas();
      window.addEventListener("resize", initCanvas);
      return () => window.removeEventListener("resize", initCanvas);
    }, [initCanvas]);

    useImperativeHandle(ref, () => ({
      isEmpty: () => !hasDrawn.current,
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const ctx = getCtx()!;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        hasDrawn.current = false;
      },
      toDataURL: (type = "image/png") =>
        canvasRef.current?.toDataURL(type) ?? "",
    }));

    const getPos = (
      e: any,
      canvas: HTMLCanvasElement
    ) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX || 0) - rect.left,
        y: (e.clientY || 0) - rect.top,
      };
    };

    const startStroke = (x: number, y: number) => {
      const ctx = getCtx();
      if (!ctx) return;
      drawing.current = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const continueStroke = (x: number, y: number) => {
      if (!drawing.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = penColor;
      ctx.lineTo(x, y);
      ctx.stroke();
      hasDrawn.current = true;
    };

    const endStroke = () => {
      drawing.current = false;
    };

    return (
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 128, display: "block" }}
        className="touch-none cursor-crosshair"
        onMouseDown={(e) => {
          const pos = getPos(e.nativeEvent, e.currentTarget);
          startStroke(pos.x, pos.y);
        }}
        onMouseMove={(e) => {
          const pos = getPos(e.nativeEvent, e.currentTarget);
          continueStroke(pos.x, pos.y);
        }}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
        onTouchStart={(e) => {
          e.preventDefault();
          const pos = getPos(e.touches[0], e.currentTarget);
          startStroke(pos.x, pos.y);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const pos = getPos(e.touches[0], e.currentTarget);
          continueStroke(pos.x, pos.y);
        }}
        onTouchEnd={endStroke}
      />
    );
  }
);

SignaturePad.displayName = "SignaturePad";
export default SignaturePad;
