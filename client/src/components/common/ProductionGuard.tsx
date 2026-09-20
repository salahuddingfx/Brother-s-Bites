'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ProductionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Only activate in production environment
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Do not block admin users in admin panel
    if (pathname.startsWith('/admin')) {
      return;
    }

    // 1. Console Security Notice
    const printSecurityBanner = () => {
      try {
        console.clear();
        console.log(
          '%c🍔 BROTHER\'S BITES %c SECURITY NOTICE ',
          'background: #F7B928; color: #09090b; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;',
          'background: #1e293b; color: #f8fafc; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
        );
        console.log(
          '%cThis application environment is protected. Unauthorized inspection, reverse engineering, or asset extraction is prohibited.',
          'color: #94a3b8; font-size: 11px; padding: 4px 0;'
        );
      } catch {
        // Ignore console restrictions
      }
    };

    printSecurityBanner();

    // 2. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      // Allow input / textarea right-click for paste/copy operations
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
    };

    // 3. Prevent DevTools & Source Inspection Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
      if (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J / Cmd+Opt+J (Developer Console)
      if (cmdOrCtrl && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C / Cmd+Opt+C (Element Inspector Tool)
      if (cmdOrCtrl && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+Opt+U (View Source Code)
      if (cmdOrCtrl && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Complete Webpage)
      if (cmdOrCtrl && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        // Allow in form inputs if needed, otherwise prevent saving whole page
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 4. Prevent Raw Image Dragging
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [pathname]);

  return null;
}
