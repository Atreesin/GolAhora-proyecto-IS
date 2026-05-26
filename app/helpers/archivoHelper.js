import fs from 'fs';

export function borrarArchivoSiExiste(file) {
    if (file) {
        fs.unlink(file.path, (err) => {
            if (err) console.error('Error al borrar archivo:', err);
        });
    }
}