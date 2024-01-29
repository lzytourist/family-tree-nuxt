export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!user.value);

    const fetchUser = async () => {
        const cookie = useCookie('AUTH-TOKEN');

        const {data, error} = await useFetch('http://127.0.0.1:8000/api/auth/users/me/', {
            watch: false,
            headers: {
                'Authorization': `Token ${cookie.value}`
            }
        });

        if (error && error.value?.statusCode === 401) {
            cookie.value = null;
        }

        user.value = data.value as User
    };

    const logout = () => {
        const cookie = useCookie('AUTH-TOKEN');
        cookie.value = null;

        user.value = null;
    };

    return {user, fetchUser, isAuthenticated, logout};
});