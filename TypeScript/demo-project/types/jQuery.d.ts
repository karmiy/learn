declare function jQuery(selector: string): any;
declare function jQuery(callback: () => any): any;
declare namespace jQuery {
    const version: string;
    interface AjaxSettings {
        method?: 'GET' | 'POST'
        data?: any;
    }
    function ajax(url: string, setting?: AjaxSettings): void;
    enum EventType {
        CustomClick,
    }
    class Event {
        blur(eventType: EventType): void;
    }
    namespace fn {
        function extend(obj: any): void;
    }
}