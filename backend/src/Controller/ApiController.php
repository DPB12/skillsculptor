<?php

namespace App\Controller;

use App\Entity\Education;
use App\Entity\Experience;
use App\Entity\Portfolio;
use App\Entity\Project;
use App\Service\ApiFormatter;
use App\Entity\User;
use App\Repository\EducationRepository;
use App\Repository\ExperienceRepository;
use App\Repository\PortfolioRepository;
use App\Repository\ProjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\UserRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api')] // gestionaremos el trafico a esta ruta

// Metodos para los usuarios

class ApiController extends AbstractController
{
    #[Route('/users', name: 'app_api_users', methods: ["GET"])]
    public function users(UserRepository $userRepository, Apiformatter $apiFormatter): JsonResponse
    {

        $users = $userRepository->findAll();

        $formattedUsers = [];

        // Iterar sobre cada usuario y formatearlo con ApiFormatter
        foreach ($users as $user) {
            $formattedUsers[] = $apiFormatter->users($user); // Llamamos al formateador con cada usuario
        }

        return new JsonResponse($formattedUsers, 200);
    }

    // Crea un nuevo usuario mediante una solicitud POST a /api/register
    #[Route('/register', name: 'app_api_register', methods: ["POST"])]
    public function createUser(Request $request, UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        if ($userRepository->emailExists($data['email'])) {
            return new JsonResponse(false, 400);
        }
        // Crear un nuevo usuario con los datos recibidos
        $user = new User();
        $user->setEmail($data['email']);
        $user->setName($data['name']);
        $user->setLastName($data['last_name']);
        $user->setRoles(['ROLE_USER']);
        $user->setImage('default.png');
        $user->setTheme([
            'mode' => 'dark',
            'color' => [
                'bg' => 'bg-blue-700',
                'hover' => 'hover:bg-blue-500',
                'text' => 'text-blue-700',
                'ring' => 'ring-blue-500',
                'border' => 'border-blue-500',
                'focusRing' => 'focus:ring-blue-500',
                'focusBorder' => 'focus:border-blue-500',
                'hex' => '#1d4ed8'
            ],
        ]);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $data['password']
            )
        );

        $portfolio = new Portfolio();
        $portfolio->setUser($user);
        $user->setPortfolio($portfolio);

        // Guardar el nuevo usuario en la base de datos
        $entityManager->persist($portfolio);
        $entityManager->persist($user);

        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $userJSON = $apiFormatter->users($user);
        return new JsonResponse($userJSON, 201);
    }

    // Realiza el proceso de inicio de sesion mediante una solicitud POST a /api//login
    #[Route('/login', name: 'app_api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordEncoder, Apiformatter $apiFormatter, JWTEncoderInterface $jwtEncoder): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $userRepository->findOneBy(['email' => $data['email']]);

        // Si el usuario no existe, devolver un error de autenticación
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que la contraseña es correcta
        $isPasswordValid = $passwordEncoder->isPasswordValid($user, $data['password']);
        if (!$isPasswordValid) {
            return new JsonResponse(['error' => 'Contraseña incorrecta'], 401);
        }

        // Generar el token JWT
        $token = $jwtEncoder->encode([
            'id' => $user->getId(),
            'username' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);

        // Devolver los datos del usuario y el token en formato JSON
        $userJSON = $apiFormatter->users($user);
        return new JsonResponse(['user' => $userJSON, 'token' => $token], 200);
    }

    #[Route('/{id}/profile', name: 'app_api_profile', methods: ["GET"])]
    public function profile(User $user, UserRepository $userRepository, Apiformatter $apiFormatter, int $id): JsonResponse
    {
        // Buscar el usuario en la base de datos por su ID
        $user = $userRepository->find($id);

        // Devolver una respuesta al cliente React
        $userJSON = $apiFormatter->users($user);
        return new JsonResponse($userJSON, 200);
    }

    #[Route('/avatar/{name}', name: 'app_api_avatar', methods: ['GET'])]
    public function avatar(UserRepository $userRepository, string $name): Response
    {
        // Buscar el usuario en la base de datos por el nombre de la imagen
        $user = $userRepository->findOneBy(['image' => $name]);

        // Obtener el nombre de la imagen del avatar
        $imageFilename = $user->getImage();

        // Construir la ruta completa de la imagen
        $imagePath = $this->getParameter('avatars') . '/' . $imageFilename;

        // Devolver la imagen como respuesta
        return new BinaryFileResponse($imagePath);
    }


    #[Route('/{id}/edit/user', name: 'app_api_edit_user', methods: ["PUT"])]
    public function edituser(Request $request, User $user, UserRepository $userRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, UserPasswordHasherInterface $passwordHasher, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el usuario en la base de datos por su ID
        $user = $userRepository->find($id);

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Verificar si el email está en uso por otro usuario
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);

        if ($existingUser && $existingUser->getId() !== $user->getId()) {
            return new JsonResponse('Este email ya está en uso', 400);
        }

        $user->setEmail($data['email']);
        $user->setName($data['name']);
        $user->setLastName($data['last_name']);
        $user->setTheme($data['theme']);

        if (!empty($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        // Guardar los cambios del usuario en la base de datos
        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $userJSON = $apiFormatter->users($user);
        return new JsonResponse($userJSON, 200);
    }

    #[Route('/{id}/upload', name: 'app_api_image_user', methods: ["POST"])]
    public function imageUser(Request $request, JWTEncoderInterface $jwtEncoder, UserRepository $userRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, SluggerInterface $slugger, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el usuario en la base de datos por su ID
        $user = $userRepository->find($id);

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Obtener el archivo de imagen desde el formulario
        $imageFile = $request->files->get('image');

        // Generar un nombre seguro para el archivo
        $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

        try {
            // Mover el archivo a la carpeta designada
            $imageFile->move(
                $this->getParameter('avatars'), // Asegúrate de que esté definido en config/services.yaml
                $newFilename
            );

            // Asignar el nuevo nombre del archivo al usuario
            $user->setImage($newFilename);

            // Guardar los cambios del usuario en la base de datos
            $entityManager->flush();

            // Devolver una respuesta al cliente
            $userJSON = $apiFormatter->users($user);
            return new JsonResponse($userJSON, 201);
        } catch (FileException $e) {
            // Manejar cualquier error durante la subida del archivo
            return new JsonResponse(['error' => 'File upload failed'], 500);
        }
    }

    // Metodos para el portfolio

    #[Route('/{id}/edit/portfolio', name: 'app_api_edit_portfolio', methods: ["PUT"])]
    public function editportolio(Request $request, Portfolio $portfolio, PortfolioRepository $portfolioRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $portfolioRepository->find($id);

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        $portfolio->setDescription($data['description']);
        $portfolio->setPosition($data['position']);
        $portfolio->setStack($data['stack']);

        // Guardar los cambios del usuario en la base de datos
        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $portfolioJSON = $apiFormatter->portfolios($portfolio);
        return new JsonResponse($portfolioJSON, 200);
    }

    // Metodos para la education

    #[Route('/{id}/education', name: 'app_api_education', methods: ["POST"])]
    public function newEducation(Request $request, JWTEncoderInterface $jwtEncoder, PortfolioRepository $portfolioRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $portfolioRepository->find($id);

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Crear una nueva instancia de Education
        $education = new Education();
        $education->setTitle($data['title']);
        $education->setDate($data['date']);
        $education->setPortfolio($portfolio); // Asociar la educación al portfolio

        // Persistir la nueva educación
        $entityManager->persist($education);
        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $educationJSON = $apiFormatter->educations($education);
        return new JsonResponse($educationJSON, 201);
    }

    #[Route('/{id}/edit/education', name: 'app_api_edit_education', methods: ["PUT"])]
    public function editEducation(Request $request, Education $education, EducationRepository $educationRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar la education en la base de datos por su id
        $education = $educationRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $education->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        $education->setTitle($data['title']);
        $education->setDate($data['date']);

        // Guardar los cambios del usuario en la base de datos
        $entityManager->flush();

        $educationJSON = $apiFormatter->educations($education);
        return new JsonResponse($educationJSON, 200);
    }

    #[Route('/{id}/delete/education', name: 'app_api_delete_education', methods: ["DELETE"])]
    public function deleteEducation(Request $request, Education $education, EducationRepository $educationRepository, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar la education en la base de datos por su id
        $education = $educationRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $education->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Eliminar la entidad Education
        $entityManager->remove($education);
        $entityManager->flush();

        // Devolver una respuesta de éxito
        return new JsonResponse(null, 204);
    }

    // Metodos para la experience

    #[Route('/{id}/experience', name: 'app_api_experience', methods: ["POST"])]
    public function newExperience(Request $request, JWTEncoderInterface $jwtEncoder, PortfolioRepository $portfolioRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $portfolioRepository->find($id);

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Crear una nueva instancia de Experience
        $experience = new Experience();
        $experience->setTitle($data['title']);
        $experience->setDate($data['date']);
        $experience->setCompany($data['company']);
        if (isset($data['page'])) {
            $experience->setPage($data['page']);
        }
        $experience->setPortfolio($portfolio); // Asociar la experience al portfolio

        // Persistir la nueva experience
        $entityManager->persist($experience);
        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $experienceJSON = $apiFormatter->experiences($experience);
        return new JsonResponse($experienceJSON, 201);
    }

    #[Route('/{id}/edit/experience', name: 'app_api_edit_experience', methods: ["PUT"])]
    public function editExperience(Request $request, Experience $experience, ExperienceRepository $experienceRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar la experience en la base de datos por su id
        $experience = $experienceRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $experience->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        $experience->setTitle($data['title']);
        $experience->setDate($data['date']);
        $experience->setCompany($data['company']);
        if (isset($data['page'])) {
            $experience->setPage($data['page']);
        }

        // Guardar los cambios del usuario en la base de datos
        $entityManager->flush();

        $experienceJSON = $apiFormatter->experiences($experience);
        return new JsonResponse($experienceJSON, 200);
    }

    #[Route('/{id}/delete/experience', name: 'app_api_delete_experience', methods: ["DELETE"])]
    public function deleteExperience(Request $request, Experience $experience, ExperienceRepository $experienceRepository, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar la experience en la base de datos por su id
        $experience = $experienceRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $experience->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Eliminar la entidad experience
        $entityManager->remove($experience);
        $entityManager->flush();

        // Devolver una respuesta de éxito
        return new JsonResponse(null, 204);
    }

    // Metodos para los project

    #[Route('/{id}/project', name: 'app_api_project', methods: ["POST"])]
    public function newProject(Request $request, JWTEncoderInterface $jwtEncoder, PortfolioRepository $portfolioRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $portfolioRepository->find($id);

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Crear una nueva instancia de Project
        $project = new Project();
        $project->setTitle($data['title']);
        $project->setDescription($data['description']);
        if (isset($data['demo'])) {
            $project->setDemo($data['demo']);
        }
        if (isset($data['github'])) {
            $project->setGithub($data['github']);
        }
        $project->setPortfolio($portfolio); // Asociar el project al portfolio

        // Persistir el nuevo project
        $entityManager->persist($project);
        $entityManager->flush();

        // Devolver una respuesta al cliente React
        $projectJSON = $apiFormatter->projects($project);
        return new JsonResponse($projectJSON, 201);
    }

    #[Route('/{id}/edit/project', name: 'app_api_edit_project', methods: ["PUT"])]
    public function editProject(Request $request, Project $project, ProjectRepository $projectRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el project en la base de datos por su id
        $project = $projectRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $project->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        $project->setTitle($data['title']);
        $project->setDescription($data['description']);
        if (isset($data['demo'])) {
            $project->setDemo($data['demo']);
        }
        if (isset($data['github'])) {
            $project->setGithub($data['github']);
        }

        // Guardar los cambios del usuario en la base de datos
        $entityManager->flush();

        $projectJSON = $apiFormatter->projects($project);
        return new JsonResponse($projectJSON, 200);
    }

    #[Route('/{id}/delete/project', name: 'app_api_delete_project', methods: ["DELETE"])]
    public function deleteProject(Request $request, Project $project, ProjectRepository $projectRepository, ManagerRegistry $doctrine, JWTEncoderInterface $jwtEncoder, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el project en la base de datos por su id
        $project = $projectRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $project->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Eliminar la entidad project
        $entityManager->remove($project);
        $entityManager->flush();

        // Devolver una respuesta de éxito
        return new JsonResponse(null, 204);
    }

    #[Route('/image/{name}', name: 'app_api_image_project', methods: ['GET'])]
    public function showImageProject(ProjectRepository $projectRepository, string $name): Response
    {
        // Buscar el proyecto en la base de datos por el nombre de la imagen
        $project = $projectRepository->findOneBy(['image' => $name]);

        // Obtener el nombre de la imagen del proyecto
        $imageFilename = $project->getImage();

        // Construir la ruta completa de la imagen
        $imagePath = $this->getParameter('images') . '/' . $imageFilename;

        // Devolver la imagen como respuesta
        return new BinaryFileResponse($imagePath);
    }

    #[Route('/project/{id}/upload', name: 'app_api_image_project_new', methods: ["POST"])]
    public function uploadImageProject(Request $request, JWTEncoderInterface $jwtEncoder, ProjectRepository $projectRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine, SluggerInterface $slugger, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();

        // Obtener el token JWT de la cabecera Authorization
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token no proporcionado'], 401);
        }

        // Extraer el token (sin la palabra "Bearer ")
        $token = substr($authHeader, 7);

        try {
            // Decodificar el token JWT
            $decodedToken = $jwtEncoder->decode($token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        // Obtener el ID del usuario desde el token
        $userIdFromToken = $decodedToken['id'];

        // Buscar el project en la base de datos por su id
        $project = $projectRepository->find($id);

        // Buscar el portfolio en la base de datos por su id
        $portfolio = $project->getPortfolio();

        // Buscar el usuario en la base de datos por su ID
        $user = $portfolio->getUser();

        // Asegurarse de que el usuario existe
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar que el ID del token coincide con el ID del usuario que se va a editar
        if ($user->getId() !== $userIdFromToken) {
            return new JsonResponse(['error' => 'No tienes permisos para editar este usuario'], 403);
        }

        // Obtener el archivo de imagen desde el formulario
        $imageFile = $request->files->get('image');

        // Generar un nombre seguro para el archivo
        $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

        try {
            // Mover el archivo a la carpeta designada
            $imageFile->move(
                $this->getParameter('images'), // Asegúrate de que esté definido en config/services.yaml
                $newFilename
            );

            // Asignar el nuevo nombre del archivo al usuario
            $project->setImage($newFilename);

            // Guardar los cambios del usuario en la base de datos
            $entityManager->flush();

            // Devolver una respuesta al cliente
            $projectJSON = $apiFormatter->projects($project);
            return new JsonResponse($projectJSON, 201);
        } catch (FileException $e) {
            // Manejar cualquier error durante la subida del archivo
            return new JsonResponse(['error' => 'File upload failed'], 500);
        }
    }
}
