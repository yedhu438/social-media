import * as PostApi from '../api/PostRequest';

export const getTimelinePosts = (id) => async (dispatch) => {
    dispatch({ type: "RETRIEVING_START" });

    try {
        // No more large URLs; sending `id` in the body instead
        const { data } = await PostApi.getTimelinePosts(id);
        dispatch({ type: "RETRIEVING_SUCCESS", data: data });
    } catch (error) {
        console.error("Error fetching timeline posts:", error.response?.data || error.message);
        dispatch({ type: "RETRIEVING_FAIL" });
    }
};
