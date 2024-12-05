<?php

namespace App\Controller;

use App\Entity\Education;
use App\Form\EducationType;
use App\Repository\EducationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/education')]
final class EducationController extends AbstractController
{
    #[Route(name: 'app_education_index', methods: ['GET'])]
    public function index(EducationRepository $educationRepository): Response
    {
        $this -> denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->render('education/index.html.twig', [
            'education' => $educationRepository->findAll(),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_education_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Education $education, EntityManagerInterface $entityManager): Response
    {
        $this -> denyAccessUnlessGranted('ROLE_ADMIN');

        $form = $this->createForm(EducationType::class, $education);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_education_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('education/edit.html.twig', [
            'education' => $education,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_education_delete', methods: ['POST'])]
    public function delete(Request $request, Education $education, EntityManagerInterface $entityManager): Response
    {
        $this -> denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete'.$education->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($education);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_education_index', [], Response::HTTP_SEE_OTHER);
    }
}
