exports.seed = async function (knex) {
    await knex('users').insert([
        {
            username: 'victor',
            password:
                '$2a$14$aGCsiV9Khl31QUxepHhAKOXVuSzYArOYcki/k8v6iMyyslla8YO3O',
        },
    ]);
};
