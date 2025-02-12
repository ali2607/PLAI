// src/api/controllers/dummyController.js

// Exemple de données en mémoire pour la démonstration
let dummyData = [
    { id: 1, name: 'Dummy One' },
    { id: 2, name: 'Dummy Two' }
  ];
  
  exports.getAllDummies = (req, res) => {
    // Gestion de la pagination via les query params ?page=1&limit=10
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || dummyData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = dummyData.slice(startIndex, endIndex);
    res.json(results);
  };
  
  exports.getDummyById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const dummy = dummyData.find(item => item.id === id);
    if (!dummy) {
      return res.status(404).json({ error: 'Dummy non trouvé' });
    }
    res.json(dummy);
  };
  
  exports.createDummy = (req, res) => {
    const newDummy = {
      id: dummyData.length ? dummyData[dummyData.length - 1].id + 1 : 1,
      name: req.body.name || 'Nom par défaut'
    };
    dummyData.push(newDummy);
    res.status(201).json(newDummy);
  };
  
  exports.updateDummy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const dummy = dummyData.find(item => item.id === id);
    if (!dummy) {
      return res.status(404).json({ error: 'Dummy non trouvé' });
    }
    dummy.name = req.body.name || dummy.name;
    res.json(dummy);
  };
  
  exports.deleteDummy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = dummyData.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Dummy non trouvé' });
    }
    dummyData.splice(index, 1);
    res.json({ message: 'Dummy supprimé avec succès' });
  };
  