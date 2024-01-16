export const useCustomUtils = () => {
    const config = useRuntimeConfig();
    const hasChildProperty = (options: any)=> options.length > 0;
    return {
        config,
        hasChildProperty,
    };
};