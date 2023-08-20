import { Logger } from '@nestjs/common';

export function Catch(serviceName: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                await originalMethod.call(this, ...args);
            } catch (e) {
                if (e instanceof Error) {
                    Logger.error(e, e.stack, serviceName);
                } else {
                    Logger.error(e, serviceName);
                }
            }
        };

        Object.setPrototypeOf(descriptor.value, originalMethod);
    };
}
