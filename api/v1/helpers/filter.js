export const getPostFilter = (query) => {
    const filter = { isDel: false };

    if(query.featured === "true") {
        filter.featured = true;
    }

    if(query.categoryId) {
        filter.categoryId = query.categoryId;
    }

    if(query.authorId) {
        filter.authorId = query.authorId;
    }

    if(query.status) {
        filter.status = query.status;
    }

    if(query.type) {
        filter.type = query.type;
    }

    if (query.isApproved !== undefined) {
        filter.isApproved = query.isApproved === "true";
    }

    return filter;
};

export default getPostFilter;
