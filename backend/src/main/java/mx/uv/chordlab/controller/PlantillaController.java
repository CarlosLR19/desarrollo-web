package mx.uv.chordlab.controller;

import mx.uv.chordlab.service.TeoriaMusicalService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlantillaController {

    private final TeoriaMusicalService teoria;

    public PlantillaController(TeoriaMusicalService teoria) {
        this.teoria = teoria;
    }

    @GetMapping("/pagina")
    public String pagina(Model model) {
        model.addAttribute("acordes",
                teoria.tiposDisponibles().stream()
                      .map(tipo -> teoria.generarAcorde("C", tipo, 0))
                      .toList());
        return "pagina";   // busca templates/pagina.html
    }
}