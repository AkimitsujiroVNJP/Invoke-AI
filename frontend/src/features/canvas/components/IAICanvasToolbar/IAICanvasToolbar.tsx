import { ButtonGroup } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import {
  resetCanvas,
  resetCanvasView,
  resizeAndScaleCanvas,
  setTool,
} from 'features/canvas/store/canvasSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import _ from 'lodash';
import IAIIconButton from 'common/components/IAIIconButton';
import {
  FaArrowsAlt,
  FaCopy,
  FaCrosshairs,
  FaDownload,
  FaLayerGroup,
  FaSave,
  FaSlidersH,
  FaTrash,
  FaUpload,
} from 'react-icons/fa';
import IAICanvasUndoButton from './IAICanvasUndoButton';
import IAICanvasRedoButton from './IAICanvasRedoButton';
import IAICanvasSettingsButtonPopover from './IAICanvasSettingsButtonPopover';
import IAICanvasEraserButtonPopover from './IAICanvasEraserButtonPopover';
import IAICanvasBrushButtonPopover from './IAICanvasBrushButtonPopover';
import IAICanvasMaskOptions from './IAICanvasMaskOptions';
import { mergeAndUploadCanvas } from 'features/canvas/store/thunks/mergeAndUploadCanvas';
import {
  canvasSelector,
  isStagingSelector,
} from 'features/canvas/store/canvasSelectors';
import { useHotkeys } from 'react-hotkeys-hook';
import { getCanvasBaseLayer } from 'features/canvas/util/konvaInstanceProvider';
import { systemSelector } from 'features/system/store/systemSelectors';
import IAICanvasToolChooserOptions from './IAICanvasToolChooserOptions';

export const selector = createSelector(
  [canvasSelector, isStagingSelector, systemSelector],
  (canvas, isStaging, system) => {
    const { isProcessing } = system;
    const { tool } = canvas;

    return {
      tool,
      isStaging,
      isProcessing,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);

const IAICanvasOutpaintingControls = () => {
  const dispatch = useAppDispatch();
  const { tool, isStaging, isProcessing } = useAppSelector(selector);
  const canvasBaseLayer = getCanvasBaseLayer();

  useHotkeys(
    ['r'],
    () => {
      handleResetCanvasView();
    },
    {
      enabled: () => true,
      preventDefault: true,
    },
    [canvasBaseLayer]
  );

  useHotkeys(
    ['shift+m'],
    () => {
      handleMergeVisible();
    },
    {
      enabled: () => !isProcessing,
      preventDefault: true,
    },
    [canvasBaseLayer, isProcessing]
  );

  useHotkeys(
    ['shift+s'],
    () => {
      handleSaveToGallery();
    },
    {
      enabled: () => !isProcessing,
      preventDefault: true,
    },
    [canvasBaseLayer, isProcessing]
  );

  useHotkeys(
    ['meta+c', 'ctrl+c'],
    () => {
      handleCopyImageToClipboard();
    },
    {
      enabled: () => !isProcessing,
      preventDefault: true,
    },
    [canvasBaseLayer, isProcessing]
  );

  useHotkeys(
    ['shift+d'],
    () => {
      handleDownloadAsImage();
    },
    {
      enabled: () => !isProcessing,
      preventDefault: true,
    },
    [canvasBaseLayer, isProcessing]
  );

  const handleResetCanvasView = () => {
    const canvasBaseLayer = getCanvasBaseLayer();
    if (!canvasBaseLayer) return;
    const clientRect = canvasBaseLayer.getClientRect({
      skipTransform: true,
    });
    dispatch(
      resetCanvasView({
        contentRect: clientRect,
      })
    );
  };

  const handleResetCanvas = () => {
    dispatch(resetCanvas());
    dispatch(resizeAndScaleCanvas());
  };

  const handleMergeVisible = () => {
    dispatch(
      mergeAndUploadCanvas({
        cropVisible: false,
        shouldSetAsInitialImage: true,
      })
    );
  };

  const handleSaveToGallery = () => {
    dispatch(
      mergeAndUploadCanvas({
        cropVisible: true,
        shouldSaveToGallery: true,
      })
    );
  };

  const handleCopyImageToClipboard = () => {
    dispatch(
      mergeAndUploadCanvas({
        cropVisible: true,
        shouldCopy: true,
      })
    );
  };

  const handleDownloadAsImage = () => {
    dispatch(
      mergeAndUploadCanvas({
        cropVisible: true,
        shouldDownload: true,
      })
    );
  };

  return (
    <div className="inpainting-settings">
      <IAICanvasMaskOptions />
      <IAICanvasToolChooserOptions />

      <ButtonGroup isAttached>
        <IAIIconButton
          aria-label="Merge Visible (Shift+M)"
          tooltip="Merge Visible (Shift+M)"
          icon={<FaLayerGroup />}
          onClick={handleMergeVisible}
          isDisabled={isProcessing}
        />
        <IAIIconButton
          aria-label="Save to Gallery (Shift+S)"
          tooltip="Save to Gallery (Shift+S)"
          icon={<FaSave />}
          onClick={handleSaveToGallery}
          isDisabled={isProcessing}
        />
        <IAIIconButton
          aria-label="Copy to Clipboard (Cmd/Ctrl+C)"
          tooltip="Copy to Clipboard (Cmd/Ctrl+C)"
          icon={<FaCopy />}
          onClick={handleCopyImageToClipboard}
          isDisabled={isProcessing}
        />
        <IAIIconButton
          aria-label="Download as Image (Shift+D)"
          tooltip="Download as Image (Shift+D)"
          icon={<FaDownload />}
          onClick={handleDownloadAsImage}
          isDisabled={isProcessing}
        />
      </ButtonGroup>
      <ButtonGroup isAttached>
        <IAICanvasUndoButton />
        <IAICanvasRedoButton />
      </ButtonGroup>

      <ButtonGroup isAttached>
        <IAIIconButton
          aria-label="Upload"
          tooltip="Upload"
          icon={<FaUpload />}
        />
        <IAIIconButton
          aria-label="Reset View (R)"
          tooltip="Reset View (R)"
          icon={<FaCrosshairs />}
          onClick={handleResetCanvasView}
        />
        <IAIIconButton
          aria-label="Clear Canvas"
          tooltip="Clear Canvas"
          icon={<FaTrash />}
          onClick={handleResetCanvas}
          style={{ backgroundColor: 'var(--btn-delete-image)' }}
        />
      </ButtonGroup>
      <ButtonGroup isAttached>
        <IAICanvasSettingsButtonPopover />
      </ButtonGroup>
    </div>
  );
};

export default IAICanvasOutpaintingControls;
