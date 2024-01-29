type Person = {};

type People = {
    count: number,
    next: string | null,
    previous: string | null,
    results: Array<Person>
};

type User = {
    id: number,
    first_name: string,
    last_name: string,
    email: string
};

type Token = {
    auth_token: string
}