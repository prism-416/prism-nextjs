type EventCallback<T = void> = (data: T) => void;

export const eventBus = (() => {
  const listeners = new Map<string, { callback: unknown; handler: EventListener }>();

  return {
    $on<T = void>(event: string, callback: EventCallback<T>) {
      const handler = (e: Event) => {
        if (e instanceof CustomEvent) {
          callback(e.detail);
        }
      };

      listeners.set(event, { callback, handler });
      window.addEventListener(event, handler);
    },

    $emit<T = void>(event: string, data?: T) {
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    },

    $remove<T = void>(event: string, callback: EventCallback<T>) {
      const stored = listeners.get(event);
      if (stored && stored.callback === callback) {
        window.removeEventListener(event, stored.handler);
        listeners.delete(event);
      }
    },
  };
})();
