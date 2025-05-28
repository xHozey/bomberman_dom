import componentStack from "./componentStack.js";


const Data = new Map();  // Key = componentTitle  Value =[{deps: [values], calback: func }]
export const Indices = new Map();  // key = componentTitle Value = index (int)

let CalbackStack = [];

export function Watch(callback, Depency = null) {
    const currentComponent = componentStack.current;
    const index = Indices.get(currentComponent) || 0;
    let Deps = Data.get(currentComponent);
    if (!Deps) {
        Data.set(currentComponent, []);
        Deps = Data.get(currentComponent);
    }

    if (!Deps[index]) {
        if ((Depency && Depency.length === 0) || !Depency) {
            CalbackStack.push(callback);
        }
        Deps[index] = {
            deps: Depency,
        }
    } else {
        if (Depency == null) {
            CalbackStack.push(callback);
        } else if (!areDepsEqual(Deps[index].deps, Depency)) {
            CalbackStack.push(callback);
            Deps[index].deps = Depency;
        }

    }
    Indices.set(currentComponent, index + 1);
}

export function applyCallbacksAfterRender() {
    CalbackStack.forEach((calback) => {
        calback();
    });
    CalbackStack = [];
}

export function isPlainObject(obj) {
    return obj !== null && typeof obj === "object" && obj.constructor === Object;
}

export function shallowEqualObjects(a, b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => a[key] === b[key]);
}

export function areDepsEqual(newDeps, oldDeps) {
    if (newDeps.length !== oldDeps.length) return false;

    return newDeps.every((dep, i) => {
        const oldDep = oldDeps[i];

        if (Array.isArray(dep) && Array.isArray(oldDep)) {
            if (dep.length !== oldDep.length) return false;
            return dep.every((val, j) => {
                if (Array.isArray(val) && Array.isArray(oldDep[j])) {
                    return areDepsEqual(val, oldDep[j]);
                } else if (isPlainObject(val) && isPlainObject(oldDep[j])) {
                    return shallowEqualObjects(val, oldDep[j]);
                }
                return val === oldDep[j];
            });
        }

        if (isPlainObject(dep) && isPlainObject(oldDep)) {
            return shallowEqualObjects(dep, oldDep);
        }

        return dep === oldDep;
    });
}
