import {useAuthStore} from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const cookie = useCookie('AUTH-TOKEN');
    const toast = useToast();

    if (!cookie.value) {
        toast.add({
            title: 'Unauthorized!',
            description: 'Please sign in first to access the document.'
        });
        return navigateTo('/sign-in');
    }

    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
        await authStore.fetchUser();

        if (!authStore.isAuthenticated) {
            toast.add({
                title: 'Unauthorized!',
                description: 'Please sign in first to access the document.'
            });
            return navigateTo('/sign-in');
        }
    }
})
