import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert, OverlayTrigger, Tooltip, Container } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/catalogueProduitApi';
import './CatalogueProduit.css';

const fournisseurColors = {
  'collaimo': '#28a745',
  'oeufs': '#ffa500',
  'jawda': '#007bff',
  'chergi': '#dc3545'
};

const CatalogueProduit = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Erreur lors de la récupération des produits');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = () => {
    setCurrentProduct({});
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id_produitBDD) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id_produitBDD);
        fetchProducts();
      } catch (err) {
        setError('Erreur lors de la suppression du produit');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct.id_produitBDD) {
        await updateProduct(currentProduct.id_produitBDD, currentProduct);
      } else {
        await createProduct(currentProduct);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(`Erreur lors de la sauvegarde du produit: ${err.message}`);
    }
  };

  // Grouper les produits par fournisseur
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.fournisseur]) {
      acc[product.fournisseur] = [];
    }
    acc[product.fournisseur].push(product);
    return acc;
  }, {});

  return (
    <Container fluid className="product-management-container">
      <h2 className="product-management-title">Catalogue des produits</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" onClick={handleCreate} className="create-product-btn">
        <FaPlus className="me-2" />Créer un nouveau produit
      </Button>
      <div className="table-responsive">
        <Table hover className="product-table">
          <thead>
            <tr>
              <th>Nom du produit</th>
              <th>Prix</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedProducts).map(([fournisseur, fournisseurProducts]) => {
              return (
                <React.Fragment key={fournisseur}>
                  <tr style={{ backgroundColor: fournisseurColors[fournisseur.toLowerCase()] }}
                    className={`fournisseur-row`}>
                    <td colSpan="3">{fournisseur}</td>
                  </tr>
                  {fournisseurProducts.map((product) => (
                    <tr 
                    key={product.id_catalogueProduit} 
                    style={{ backgroundColor: `${fournisseurColors[fournisseur.toLowerCase()]}20` }}
                    className={`product-row`}
                  >
                      <td>{product.name}</td>
                      <td>{product.prixVenteUnite}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Éditer</Tooltip>}>
                            <Button variant="light" size="sm" onClick={() => handleEdit(product)} className="me-2 action-btn">
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Supprimer</Tooltip>}>
                            <Button variant="light" size="sm" onClick={() => handleDelete(product.id_catalogueProduit)} className="action-btn">
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct.id_produitBDD ? 'Modifier' : 'Créer'} un produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom du produit</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.name || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={currentProduct.prixVenteUnite || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, prixVenteUnite: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fournisseur</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct.fournisseur || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, fournisseur: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sauvegarder
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CatalogueProduit;
