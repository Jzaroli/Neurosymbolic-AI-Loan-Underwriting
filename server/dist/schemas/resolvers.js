const resolvers = {
    Query: {
        _health: () => 'ok',
    },
    Mutation: {
        submitProfile: async (_parent, { input }) => {
            console.log(input);
            return { placeholder: 1 };
        },
    }
};
export default resolvers;
