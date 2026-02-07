export type ScrollPosition = {
    x: number;
    y: number;
};

export type ScrollStore = {
    [page: string]: {
        [key: string]: ScrollPosition;
    };
};
