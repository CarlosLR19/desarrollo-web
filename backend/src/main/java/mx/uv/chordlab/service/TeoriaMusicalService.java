package mx.uv.chordlab.service;

import mx.uv.chordlab.dto.AcordeGenerado;
import mx.uv.chordlab.dto.AcordeProgresion;
import mx.uv.chordlab.dto.ProgresionGenerada;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Lógica musical de ChordLab (RF07, RF08, RF10).
 *
 * Idea principal: cada nota se maneja con dos datos
 *   - su clase de altura (0..11 semitonos desde C) para saber cómo SUENA, y
 *   - su letra (C D E F G A B) para saber cómo se ESCRIBE.
 * Cada intervalo se define como (semitonos, pasos de letra). Así una tercera menor
 * sobre F se escribe Ab (y no G#), igual que en un libro de teoría.
 */
@Service
public class TeoriaMusicalService {

    private static final String LETRAS = "CDEFGAB";
    private static final int[] SEMITONOS_LETRA = {0, 2, 4, 5, 7, 9, 11};
    private static final String[] SOSTENIDOS = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};
    private static final String[] NOMBRES_ES = {"Do", "Re", "Mi", "Fa", "Sol", "La", "Si"};

    /** Intervalo = semitonos sobre la fundamental + cuántas letras se avanza. */
    private record Intervalo(int semitonos, int pasos) {}

    private record TipoAcorde(String clave, String simbolo, String nombre, List<Intervalo> intervalos) {}

    private static final Intervalo UNISONO = new Intervalo(0, 0);
    private static final Intervalo SEGUNDA_M = new Intervalo(2, 1);
    private static final Intervalo TERCERA_m = new Intervalo(3, 2);
    private static final Intervalo TERCERA_M = new Intervalo(4, 2);
    private static final Intervalo CUARTA_J = new Intervalo(5, 3);
    private static final Intervalo QUINTA_DIS = new Intervalo(6, 4);
    private static final Intervalo QUINTA_J = new Intervalo(7, 4);
    private static final Intervalo QUINTA_AUM = new Intervalo(8, 4);
    private static final Intervalo SEPTIMA_DIS = new Intervalo(9, 6);
    private static final Intervalo SEPTIMA_m = new Intervalo(10, 6);
    private static final Intervalo SEPTIMA_M = new Intervalo(11, 6);

    private static final Map<String, TipoAcorde> TIPOS = new LinkedHashMap<>();
    private static final Map<String, String> ALIAS = new HashMap<>();

    static {
        agregarTipo("mayor", "", "mayor", UNISONO, TERCERA_M, QUINTA_J);
        agregarTipo("menor", "m", "menor", UNISONO, TERCERA_m, QUINTA_J);
        agregarTipo("disminuido", "dim", "disminuido", UNISONO, TERCERA_m, QUINTA_DIS);
        agregarTipo("aumentado", "aug", "aumentado", UNISONO, TERCERA_M, QUINTA_AUM);
        agregarTipo("sus2", "sus2", "suspendido segunda", UNISONO, SEGUNDA_M, QUINTA_J);
        agregarTipo("sus4", "sus4", "suspendido cuarta", UNISONO, CUARTA_J, QUINTA_J);
        agregarTipo("7", "7", "séptima", UNISONO, TERCERA_M, QUINTA_J, SEPTIMA_m);
        agregarTipo("maj7", "maj7", "mayor séptima", UNISONO, TERCERA_M, QUINTA_J, SEPTIMA_M);
        agregarTipo("m7", "m7", "menor séptima", UNISONO, TERCERA_m, QUINTA_J, SEPTIMA_m);
        agregarTipo("m7b5", "m7b5", "semidisminuido", UNISONO, TERCERA_m, QUINTA_DIS, SEPTIMA_m);
        agregarTipo("dim7", "dim7", "disminuido séptima", UNISONO, TERCERA_m, QUINTA_DIS, SEPTIMA_DIS);

        String[][] alias = {
                {"m", "menor"}, {"min", "menor"}, {"minor", "menor"},
                {"major", "mayor"}, {"maj", "mayor"},
                {"dim", "disminuido"}, {"aug", "aumentado"}, {"+", "aumentado"},
                {"septima", "7"}, {"séptima", "7"}, {"dom7", "7"},
                {"mayor7", "maj7"}, {"menor7", "m7"}, {"semidisminuido", "m7b5"},
        };
        for (String[] a : alias) ALIAS.put(a[0], a[1]);
    }

    private static void agregarTipo(String clave, String simbolo, String nombre, Intervalo... intervalos) {
        TIPOS.put(clave, new TipoAcorde(clave, simbolo, nombre, List.of(intervalos)));
    }

    // ---------------------------------------------------------------- notas

    /** Nota escrita: letra (0..6 = C..B) + alteración (-2..2). */
    private record Nota(int letra, int alteracion) {
        int claseAltura() {
            return Math.floorMod(SEMITONOS_LETRA[letra] + alteracion, 12);
        }

        String texto() {
            String alt = switch (alteracion) {
                case -2 -> "bb";
                case -1 -> "b";
                case 1 -> "#";
                case 2 -> "##";
                default -> "";
            };
            return LETRAS.charAt(letra) + alt;
        }

        String nombreEspanol() {
            String alt = switch (alteracion) {
                case -2 -> " doble bemol";
                case -1 -> " bemol";
                case 1 -> " sostenido";
                case 2 -> " doble sostenido";
                default -> "";
            };
            return NOMBRES_ES[letra] + alt;
        }

        /** Nota que está a "intervalo" de esta, con su ortografía correcta. */
        Nota mas(Intervalo intervalo) {
            int nuevaLetra = (letra + intervalo.pasos()) % 7;
            int objetivo = Math.floorMod(claseAltura() + intervalo.semitonos(), 12);
            int diferencia = Math.floorMod(objetivo - SEMITONOS_LETRA[nuevaLetra], 12);
            if (diferencia > 6) diferencia -= 12;
            return new Nota(nuevaLetra, diferencia);
        }
    }

    /** Convierte texto como "c", "C#", "Db", "bb" (Si bemol) en una Nota. */
    private Nota leerNota(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("La nota es obligatoria");
        }
        String t = texto.trim().replace('♯', '#').replace('♭', 'b');
        int letra = LETRAS.indexOf(Character.toUpperCase(t.charAt(0)));
        String resto = t.substring(1);
        int alteracion = switch (resto) {
            case "" -> 0;
            case "#" -> 1;
            case "##" -> 2;
            case "b" -> -1;
            case "bb" -> -2;
            default -> 99;
        };
        if (letra < 0 || alteracion == 99) {
            throw new IllegalArgumentException("Nota no válida: '" + texto + "'. Ejemplos válidos: C, C#, Db, F#, Bb");
        }
        return new Nota(letra, alteracion);
    }

    /** Devuelve la nota escrita de forma estándar ("db" -> "Db"). Lanza IllegalArgumentException si no es válida. */
    public String normalizarNota(String texto) {
        return leerNota(texto).texto();
    }

    // ---------------------------------------------------------------- acordes

    /** Devuelve la clave interna del tipo de acorde ("Maj7" -> "maj7", "m" -> "menor"). */
    public String normalizarTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("El tipo de acorde es obligatorio");
        }
        String t = tipo.trim();
        if (TIPOS.containsKey(t)) return t;               // respeta "m" vs "M" antes de pasar a minúsculas
        if (t.equals("M")) return "mayor";
        String minus = t.toLowerCase(Locale.ROOT);
        if (TIPOS.containsKey(minus)) return minus;
        if (ALIAS.containsKey(t)) return ALIAS.get(t);
        if (ALIAS.containsKey(minus)) return ALIAS.get(minus);
        throw new IllegalArgumentException("Tipo de acorde no soportado: '" + tipo + "'. Tipos válidos: " + TIPOS.keySet());
    }

    public List<String> tiposDisponibles() {
        return new ArrayList<>(TIPOS.keySet());
    }

    /**
     * Genera un acorde (RF07) y sus notas (RF08).
     *
     * @param inversion 0 = estado fundamental, 1 = primera inversión, etc.
     */
    public AcordeGenerado generarAcorde(String fundamental, String tipo, int inversion) {
        Nota raiz = leerNota(fundamental);
        TipoAcorde t = TIPOS.get(normalizarTipo(tipo));
        int cantidad = t.intervalos().size();
        if (inversion < 0 || inversion >= cantidad) {
            throw new IllegalArgumentException("Inversión no válida para un acorde de " + cantidad
                    + " notas: use un valor entre 0 y " + (cantidad - 1));
        }

        List<String> notas = new ArrayList<>();
        List<Integer> midi = new ArrayList<>();
        int midiRaiz = 60 + raiz.claseAltura();            // fundamental en la octava 4 (C4 = 60)
        for (Intervalo i : t.intervalos()) {
            notas.add(raiz.mas(i).texto());
            midi.add(midiRaiz + i.semitonos());
        }

        // Inversión: las primeras notas pasan arriba (una octava más alta)
        Collections.rotate(notas, -inversion);
        for (int k = 0; k < inversion; k++) {
            midi.add(midi.remove(0) + 12);
        }

        List<String> conOctava = midi.stream()
                .map(m -> SOSTENIDOS[m % 12] + (m / 12 - 1))
                .toList();

        String nombre = raiz.nombreEspanol() + " " + t.nombre();
        if (inversion > 0) nombre += " (" + inversion + "ª inversión)";

        return new AcordeGenerado(raiz.texto(), t.clave(), inversion, raiz.texto() + t.simbolo(), nombre, notas, conOctava);
    }

    // ---------------------------------------------------------------- escalas y progresiones

    private static final List<Intervalo> ESCALA_MAYOR = List.of(UNISONO, SEGUNDA_M, TERCERA_M, CUARTA_J,
            QUINTA_J, new Intervalo(9, 5), SEPTIMA_M);
    private static final List<Intervalo> ESCALA_MENOR = List.of(UNISONO, SEGUNDA_M, TERCERA_m, CUARTA_J,
            QUINTA_J, new Intervalo(8, 5), SEPTIMA_m);

    /** Tipo de acorde que se forma sobre cada grado (triadas y cuatriadas). */
    private static final String[] TRIADAS_MAYOR = {"mayor", "menor", "menor", "mayor", "mayor", "menor", "disminuido"};
    private static final String[] SEPTIMAS_MAYOR = {"maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"};
    private static final String[] TRIADAS_MENOR = {"menor", "disminuido", "mayor", "menor", "menor", "mayor", "mayor"};
    private static final String[] SEPTIMAS_MENOR = {"m7", "m7b5", "maj7", "m7", "m7", "maj7", "7"};

    private static final String[] ROMANOS = {"I", "II", "III", "IV", "V", "VI", "VII"};

    /** Patrones de grados (0 = I). Se repiten hasta completar la cantidad pedida. */
    private static final Map<String, int[]> PATRONES_MAYOR = Map.of(
            "pop", new int[]{0, 4, 5, 3},          // I - V - vi - IV
            "clasico", new int[]{0, 3, 4, 0},      // I - IV - V - I
            "jazz", new int[]{1, 4, 0, 0},         // ii7 - V7 - Imaj7
            "blues", new int[]{0, 3, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4}); // blues de 12 compases
    private static final Map<String, int[]> PATRONES_MENOR = Map.of(
            "pop", new int[]{0, 5, 2, 6},          // i - VI - III - VII
            "clasico", new int[]{0, 3, 4, 0},      // i - iv - V - i
            "jazz", new int[]{1, 4, 0, 0},         // iiø7 - V7 - im7
            "blues", new int[]{0, 3, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4});

    /**
     * Reglas de armonía funcional para el estilo "aleatorio":
     * desde cada grado solo se puede ir a ciertos grados (tónica -> subdominante -> dominante -> tónica).
     */
    private static final int[][] SIGUIENTES = {
            {1, 2, 3, 4, 5},   // I   -> cualquiera
            {4, 6},            // ii  -> V, vii°
            {5, 3},            // iii -> vi, IV
            {4, 0, 1, 6},      // IV  -> V, I, ii, vii°
            {0, 5},            // V   -> I, vi (cadencia rota)
            {1, 3},            // vi  -> ii, IV
            {0},               // vii° -> I
    };

    public static final List<String> ESTILOS = List.of("pop", "clasico", "jazz", "blues", "aleatorio");

    public String normalizarEscala(String escala) {
        if (escala == null) throw new IllegalArgumentException("La escala es obligatoria");
        return switch (escala.trim().toLowerCase(Locale.ROOT)) {
            case "mayor", "major", "jonica", "jónica" -> "mayor";
            case "menor", "minor", "menor natural", "eolica", "eólica" -> "menor";
            default -> throw new IllegalArgumentException("Escala no soportada: '" + escala + "'. Use mayor o menor");
        };
    }

    /** Notas de la escala, p. ej. F mayor -> F G A Bb C D E. */
    public List<String> notasEscala(String tonalidad, String escala) {
        Nota tonica = leerNota(tonalidad);
        List<Intervalo> intervalos = normalizarEscala(escala).equals("mayor") ? ESCALA_MAYOR : ESCALA_MENOR;
        return intervalos.stream().map(i -> tonica.mas(i).texto()).toList();
    }

    /** Genera una progresión armónica según tonalidad, escala y estilo (RF10). */
    public ProgresionGenerada generarProgresion(String tonalidad, String escala, int cantidad, String estilo, Long semilla) {
        Nota tonica = leerNota(tonalidad);
        String esc = normalizarEscala(escala);
        String est = (estilo == null || estilo.isBlank()) ? "pop" : estilo.trim().toLowerCase(Locale.ROOT)
                .replace("clásico", "clasico");
        if (!ESTILOS.contains(est)) {
            throw new IllegalArgumentException("Estilo no soportado: '" + estilo + "'. Estilos válidos: " + ESTILOS);
        }
        if (cantidad < 2 || cantidad > 16) {
            throw new IllegalArgumentException("La cantidad de acordes debe estar entre 2 y 16");
        }

        boolean mayor = esc.equals("mayor");
        List<Intervalo> grados = mayor ? ESCALA_MAYOR : ESCALA_MENOR;
        int[] secuencia = est.equals("aleatorio")
                ? secuenciaAleatoria(cantidad, semilla == null ? new Random() : new Random(semilla))
                : repetirPatron((mayor ? PATRONES_MAYOR : PATRONES_MENOR).get(est), cantidad);

        List<AcordeProgresion> acordes = new ArrayList<>();
        for (int g : secuencia) {
            String tipo = tipoParaGrado(g, mayor, est);
            Nota raiz = tonica.mas(grados.get(g));
            AcordeGenerado a = generarAcorde(raiz.texto(), tipo, 0);
            acordes.add(new AcordeProgresion(a.simbolo(), numeroRomano(g, tipo), a.fundamental(), a.tipo(), a.notas()));
        }
        return new ProgresionGenerada(tonica.texto(), esc, est, acordes);
    }

    private String tipoParaGrado(int grado, boolean mayor, String estilo) {
        boolean septimas = estilo.equals("jazz");
        if (estilo.equals("blues")) {
            return mayor ? "7" : (grado == 4 ? "7" : "m7");
        }
        // En menor, la dominante (V) se toma de la escala menor armónica para que "resuelva" a la tónica.
        if (!mayor && grado == 4 && (estilo.equals("clasico") || estilo.equals("jazz"))) {
            return septimas ? "7" : "mayor";
        }
        String[] tabla = mayor ? (septimas ? SEPTIMAS_MAYOR : TRIADAS_MAYOR) : (septimas ? SEPTIMAS_MENOR : TRIADAS_MENOR);
        return tabla[grado];
    }

    private String numeroRomano(int grado, String tipo) {
        String base = ROMANOS[grado];
        return switch (tipo) {
            case "menor" -> base.toLowerCase(Locale.ROOT);
            case "disminuido" -> base.toLowerCase(Locale.ROOT) + "°";
            case "m7" -> base.toLowerCase(Locale.ROOT) + "7";
            case "m7b5" -> base.toLowerCase(Locale.ROOT) + "ø7";
            case "7" -> base + "7";
            case "maj7" -> base + "maj7";
            default -> base;
        };
    }

    private int[] repetirPatron(int[] patron, int cantidad) {
        int[] r = new int[cantidad];
        for (int i = 0; i < cantidad; i++) r[i] = patron[i % patron.length];
        return r;
    }

    /** Recorrido aleatorio siguiendo SIGUIENTES; inicia en la tónica y termina en cadencia (V o I). */
    private int[] secuenciaAleatoria(int cantidad, Random random) {
        int[] r = new int[cantidad];
        r[0] = 0;
        for (int i = 1; i < cantidad; i++) {
            int[] opciones = SIGUIENTES[r[i - 1]];
            r[i] = opciones[random.nextInt(opciones.length)];
        }
        // Cadencia final: si el penúltimo acorde lleva a la tónica, cerramos en I; si no, en V (semicadencia).
        int penultimo = r[cantidad - 2];
        r[cantidad - 1] = (penultimo == 4 || penultimo == 6 || penultimo == 3) ? 0 : 4;
        return r;
    }
}
