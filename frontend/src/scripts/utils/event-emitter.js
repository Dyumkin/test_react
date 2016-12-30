import { EventEmitter } from 'events';

export const PAGE_WRAPPER_ADD_CLASS = 'page.wrapper.addClass';
export const PAGE_WRAPPER_REMOVE_CLASS = 'page.wrapper.removeClass';
export const PAGE_WRAPPER_TOGGLE_CLASS = 'page.wrapper.toggleClass';

export const NOTIFICATOR_ITEM_ADD = 'notificator.item.add';

export default new EventEmitter();
