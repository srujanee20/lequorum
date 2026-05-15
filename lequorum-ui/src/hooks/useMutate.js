import { useMutation } from '@tanstack/react-query';
import { toaster } from '$components/ui/AppToaster.jsx';

const useMutate = (mutationFn, options = {}) => {
    const { onError, ...rest } = options;

    return useMutation({
        mutationFn,
        onError: (err) => {
            toaster.create({
                title: err.response?.data?.error || 'Something went wrong',
                type: 'error',
                duration: 3000
            });
            onError?.(err);
        },
        ...rest
    });
};

export default useMutate;
