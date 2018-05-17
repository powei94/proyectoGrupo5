package com.mingeso.grupo5.proyecto.controllers;
import org.junit.Assert;
import org.junit.Test;
import java.util.List;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


import com.mingeso.grupo5.proyecto.controllers.SolutionController;
import com.mingeso.grupo5.proyecto.entities.Solution;
import com.mingeso.grupo5.proyecto.entities.Statement;
import com.mingeso.grupo5.proyecto.repositories.SolutionRepository;


@RunWith(SpringRunner.class)
@SpringBootTest
public class SolutionControllerTest {
	@Autowired 
	private SolutionRepository solutionRepository;
	
	Statement statement = new Statement();
	Integer idStatement = 1;
	String solutionName = "solution";
	String solutionText = "print('Hola mundo')";
	Integer idUser = 1;
	
	SolutionController controlador = new SolutionController();
	
	@Test
    public void getAllSolution() {
		Assert.assertNotNull(controlador.getAllsolution()); 
	}
	@Test
    public void addNewSolution() {
		
		String resultadoEsperado = "Producto guardado.";
		Assert.assertEquals(resultadoEsperado ,controlador.addNewSolution(idStatement, solutionName, solutionText, idUser));
    }
	@Test
    public void updateSolution() {

		String resultadoEsperado = "Producto actualizado.";
		Assert.assertEquals(resultadoEsperado ,controlador.updateSolution(1, idStatement, solutionName, solutionText, idUser));
		
    }
	@Test
    public void findOneSolution() {
		Assert.assertNotNull(controlador.findOne(1));
    }
	@Test
    public void deletesolution() {
		String resultadoEsperado = "Producto eliminado";
		Assert.assertEquals(resultadoEsperado ,controlador.delete(1));
    }
	
	
}