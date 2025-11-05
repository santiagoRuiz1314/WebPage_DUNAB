/**
 * Servicio para gestión de categorías de transacciones DUNAB
 */

import { get, post, put, del } from './api';

/**
 * Obtener todas las categorías
 * @returns {Promise<Array>} Lista de categorías
 */
export const getAllCategories = async () => {
  try {
    const response = await get('/dunab/categories');
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Obtener categoría por ID
 * @param {number} id - ID de la categoría
 * @returns {Promise<Object>} Categoría
 */
export const getCategoryById = async (id) => {
  try {
    const response = await get(`/dunab/categories/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

/**
 * Crear nueva categoría
 * @param {Object} categoryData - Datos de la categoría
 * @param {string} categoryData.name - Nombre de la categoría
 * @param {string} categoryData.type - Tipo (INCOME/EXPENSE)
 * @param {string} categoryData.description - Descripción
 * @returns {Promise<Object>} Categoría creada
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await post('/dunab/categories', categoryData);
    return response;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Actualizar categoría existente
 * @param {number} id - ID de la categoría
 * @param {Object} categoryData - Datos a actualizar
 * @returns {Promise<Object>} Categoría actualizada
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await put(`/dunab/categories/${id}`, categoryData);
    return response;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar categoría
 * @param {number} id - ID de la categoría
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  try {
    const response = await del(`/dunab/categories/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener categorías por tipo
 * @param {string} type - Tipo de categoría (INCOME/EXPENSE)
 * @returns {Promise<Array>} Lista de categorías filtradas
 */
export const getCategoriesByType = async (type) => {
  try {
    const response = await get(`/dunab/categories?type=${type}`);
    return response;
  } catch (error) {
    console.error(`Error fetching categories by type ${type}:`, error);
    throw error;
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByType,
};
