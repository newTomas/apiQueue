"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = exports.getQueue = void 0;
var queues = {};
function getQueue(name) {
    return function apiQueue(fn, noErrors = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(name in queues))
                throw `unknown queue ${name}`;
            return new Promise((resolve, reject) => {
                queues[name].push({ fn, resolve, reject, noErrors });
            });
        });
    };
}
exports.getQueue = getQueue;
function createQueue(name, interval) {
    if (name in queues)
        return getQueue(name);
    queues[name] = [];
    setInterval(handleQueue, interval, queues[name]);
    return getQueue(name);
}
exports.createQueue = createQueue;
function handleQueue(jobs) {
    return __awaiter(this, void 0, void 0, function* () {
        var cur = jobs.shift();
        if (cur) {
            cur.fn().then(cur.resolve, !cur.noErrors ? cur.reject : (err) => cur.resolve(err));
        }
    });
}
//# sourceMappingURL=index.js.map