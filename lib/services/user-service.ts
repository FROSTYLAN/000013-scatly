import { db } from '@/lib/database';
import { User, CreateUserInput, UserResponse } from '@/types/user-types';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios (solo para administradores)
export async function getAllUsers(): Promise<UserResponse[]> {
  try {
    const result = await db.query('SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    return result.rows as UserResponse[];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Obtener un usuario por ID (sin exponer la contraseña)
export async function getUserById(id: number): Promise<UserResponse | null> {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as UserResponse;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
}

// Obtener un usuario por email (incluye password_hash para verificación)
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as User;
  } catch (error) {
    console.error(`Error al obtener usuario con email ${email}:`, error);
    throw error;
  }
}

// Crear un nuevo usuario
export async function createUser(userData: CreateUserInput): Promise<UserResponse> {
  try {
    // Verificar si el email ya existe
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    // Generar hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    
    // Insertar el nuevo usuario
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, created_at, updated_at`,
      [userData.username, userData.email, passwordHash, 'user']
    );
    
    return result.rows[0] as UserResponse;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Verificar credenciales de usuario
export async function verifyUserCredentials(email: string, password: string): Promise<UserResponse | null> {
  try {
    // Obtener usuario con contraseña hash
    const user = await getUserByEmail(email);
    
    if (!user) {
      return null; // Usuario no encontrado
    }
    
    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return null; // Contraseña incorrecta
    }
    
    // Devolver usuario sin contraseña
    const { password_hash, ...userResponse } = user;
    return userResponse as UserResponse;
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    throw error;
  }
}