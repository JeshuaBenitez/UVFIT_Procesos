// src/services/UserService.ts
import { REACT_NATIVE_API_URL } from '@env'; // ✅ Importación necesaria para login real

export type User = {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  matricula: string;
  carrera: string;
  semestre: string;
  sexo: string;
  password: string;
};

class UserService {
  private users: User[] = [];

  public addUser(user: User): void {
    this.users.push(user);
  }

  public validateCredentials(matricula: string, password: string): boolean {
    return this.users.some(
      (u) =>
        u.matricula.toUpperCase() === matricula.toUpperCase() &&
        u.password === password
    );
  }

  public getUserByMatricula(matricula: string): User | undefined {
    return this.users.find(
      (u) => u.matricula.toUpperCase() === matricula.toUpperCase()
    );
  }

  public updateUser(updated: User): boolean {
    const idx = this.users.findIndex(
      (u) => u.matricula.toUpperCase() === updated.matricula.toUpperCase()
    );
    if (idx === -1) return false;
    this.users[idx] = { ...this.users[idx], ...updated };
    return true;
  }

  // ✅ Función para autenticación real con backend
  public async loginUser(
    matricula: string,
    password: string
  ): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      const response = await fetch(`${REACT_NATIVE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en loginUser:', error);
      throw error;
    }
  }
}

export default new UserService();
