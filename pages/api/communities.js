import { SiteClient } from 'datocms-client'

const receiveData = async (req, res) => {
    if (req.method === 'POST') {
        const TOKEN = 'ca28dc45b612eb31e019ffc4b1f6ab'
        const client = new SiteClient(TOKEN)

        const recordCreated = await client.items.create({
            itemType: "975099",
            ...req.body,
        })

        res.json({
            data: 'Dados a API',
            recordCreated: recordCreated
        });

        return;
    }

    res.status(400).json({
        error: 'Não vem que não tem!'
    })
}

export default receiveData