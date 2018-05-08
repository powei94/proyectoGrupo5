package com.mingeso.grupo5.proyecto;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class solution {
	 @Id
	 @GeneratedValue(strategy=GenerationType.AUTO)
	 private Integer IdSolution;
	 
	 @NotNull
	 private Integer IdStatement;
	 
	 @NotNull
	 private String solutionName;
	 
	 @NotNull
	 private String solutionText;
	 
	 @NotNull
	 private Integer idUser;
	 
	 public Integer getIdSolution() {
		 return this.IdSolution;
	 }
	 
	 public Integer getIdStatement() {
		 return this.IdStatement;
	 }
	 
	 public void setIdStatement(Integer id) {
		 this.IdStatement = id;
	 }
	 
	 public String getSolutionName() {
		 return this.solutionName;
	 }
	 public void setSolutionName(String name) {
		 this.solutionName = name;
	 }
	 
	 public String getSolutionText() {
		 return this.solutionText;
	 }
	 
	 public void setSolutionText(String text) {
		 this.solutionText = text;
	 }
	 
	 public Integer getIdUser() {
		 return this.idUser;
	 }
	 public void setIdUser(Integer id) {
		 this.idUser = id;
	 }
	 
}