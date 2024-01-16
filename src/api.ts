export class Api<T> {
    private base: string;
    constructor(base: string = 'http://localhost:3311/') {
        this.base = base;
    }

    getJson<T>(route: string) {
        return fetch(this.base + route)
            .then(rs => rs.json())
            .then(r => r as T)
    }

    postJson<T, K>(route: string, body: T) {
        const b = JSON.stringify(body);
        return fetch(this.base + route, {
            method: 'POST',
            body: b,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(rs => rs.json())
            .then(r => r as K)
    }

    putJson<T, K>(route: string, body: T) {
        const b = JSON.stringify(body);
        return fetch(this.base + route, {
            method: 'PUT',
            body: b,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(rs => rs.json())
            .then(r => r as K)
    }

    list() {
        return this.getJson<T[]>('posts');
    }

    get(id: number) {
        return this.getJson<T>('posts/' + id);
    }

    post<T, K>(body: T) {
        return this.postJson<T, K>('posts', body);
    }

    put<T, K>(id: number,  body: T) {
        return this.putJson<T, K>('posts/' + id, body);
    }
}
