export const stateColor = (state) => {
    if (state === 'active') return 'brand';
    if (state === 'published') return 'purple';
    return 'red';
};

export const stateLabel = (state) => {
    if (state === 'active') return 'Active';
    if (state === 'published') return 'Published';
    return 'Expired';
};

export const pollShareUrl = (id) => {
    return `${window.location.origin}/poll/${id}`;
};
