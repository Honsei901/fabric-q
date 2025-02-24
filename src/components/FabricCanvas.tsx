import * as fabric from 'fabric';
import { useEffect, useRef, useState } from 'react';

const FabricCanvas = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const svgStr = e.target?.result;
      if (typeof svgStr === 'string' && canvas) {
        const { objects } = await fabric.loadSVGFromString(svgStr);
        if (!objects || objects.length === 0) return;

        // 全オブジェクトのバウンディングボックスを計算する
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        objects.forEach((obj) => {
          // オブジェクトの境界を更新
          if (obj) {
            obj.setCoords();
            const bound = obj.getBoundingRect();
            minX = Math.min(minX, bound.left);
            minY = Math.min(minY, bound.top);
            maxX = Math.max(maxX, bound.left + bound.width);
            maxY = Math.max(maxY, bound.top + bound.height);
          }
        });

        // 描画されたsvgの縦幅
        const svgWidth = maxX - minX;
        const svgHeight = maxY - minY;

        // キャンバスサイズに合わせるためのスケールファクターを計算
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const scaleFactor = Math.min(
          canvasWidth / svgWidth,
          canvasHeight / svgHeight
        );

        // SVG全体をキャンバス中央に配置するためのオフセットを計算
        const offsetX = (canvasWidth - svgWidth * scaleFactor) / 2;
        const offsetY = (canvasHeight - svgHeight * scaleFactor) / 2;

        // 各オブジェクトごとに位置とスケールを調整
        objects.forEach((obj) => {
          // オブジェクトの元の位置からバウンディングボックスの左上を基準にする
          if (obj) {
            obj.set({
              left: (obj.left! - minX) * scaleFactor + offsetX,
              top: (obj.top! - minY) * scaleFactor + offsetY,
              scaleX: (obj.scaleX || 1) * scaleFactor,
              scaleY: (obj.scaleY || 1) * scaleFactor,
            });
            obj.setCoords();
            canvas.add(obj);
          }
        });

        canvas.renderAll();
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
      setCanvas(fabricCanvasRef.current);
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className="mt-4">
        <input type="file" accept=".svg" onChange={handleFileChange} />
        <div className="mt-4">
          <canvas
            ref={canvasRef}
            width={1000}
            height={900}
            className="border-2"
          />
        </div>
      </div>
    </div>
  );
};

export default FabricCanvas;

/**   
 *         // オリジナルの順番を保持するためコピーを作成
        const originalOrder = [...objects];

        // グループにしてキャンバス中央へ配置
        const group = new fabric.Group(objects as fabric.Object[], {
          originX: 'center',
          originY: 'center',
        });
        group.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
        });
        canvas.add(group);
        canvas.renderAll();

        // 例: 1秒後にグループ解除
        setTimeout(() => {
          // グループを削除
          canvas.remove(group);
          // 元の順番でオブジェクトを再追加
          originalOrder.forEach((item) => {
            if (item) {
              canvas.add(item);
            }
          });
          canvas.renderAll();
        }, 1000);
 * 
 * 
 */

/** 
 *         const svgGroup = fabric.util.groupSVGElements(
          objects as fabric.Object[],
          options
        );

        // キャンバスのサイズ取得
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // SVGのオリジナルサイズ取得
        const svgWidth = svgGroup.width || 0;
        const svgHeight = svgGroup.height || 0;

        // キャンバスに収まるようなスケールを計算（幅と高さの両方に合わせる）
        const scaleFactor = Math.min(
          canvasWidth / svgWidth,
          canvasHeight / svgHeight
        );
        svgGroup.scale(scaleFactor);

        // キャンバスの中央に配置
        svgGroup.set({
          left: (canvasWidth - svgWidth * scaleFactor) / 2,
          top: (canvasHeight - svgHeight * scaleFactor) / 2,
        });

        canvas.add(svgGroup);
        canvas.renderAll();
 * 
 * 
 */

/** 良さげ
 *         // 全オブジェクトのバウンディングボックスを計算する
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        objects.forEach((obj) => {
          // オブジェクトの境界を更新
          if (obj) {
            obj.setCoords();
            const bound = obj.getBoundingRect();
            minX = Math.min(minX, bound.left);
            minY = Math.min(minY, bound.top);
            maxX = Math.max(maxX, bound.left + bound.width);
            maxY = Math.max(maxY, bound.top + bound.height);
          }
        });

        const svgWidth = maxX - minX;
        const svgHeight = maxY - minY;

        // キャンバスサイズに合わせるためのスケールファクターを計算
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const scaleFactor = Math.min(
          canvasWidth / svgWidth,
          canvasHeight / svgHeight
        );

        // SVG全体をキャンバス中央に配置するためのオフセットを計算
        const offsetX = (canvasWidth - svgWidth * scaleFactor) / 2;
        const offsetY = (canvasHeight - svgHeight * scaleFactor) / 2;

        // 各オブジェクトごとに位置とスケールを調整
        objects.forEach((obj) => {
          // オブジェクトの元の位置からバウンディングボックスの左上を基準にする
          if (obj) {
            obj.set({
              left: (obj.left! - minX) * scaleFactor + offsetX,
              top: (obj.top! - minY) * scaleFactor + offsetY,
              scaleX: (obj.scaleX || 1) * scaleFactor,
              scaleY: (obj.scaleY || 1) * scaleFactor,
            });
            obj.setCoords();
            canvas.add(obj);
          }
        });

        canvas.renderAll();
 */
