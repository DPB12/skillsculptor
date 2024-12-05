<?php
namespace App\Service;

class ApiFormatter
{
    public function users($user): array
    {
        $userJSON=[];

        $userJSON = array (
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'last_name' => $user->getLastName(),
            // 'password' => $user->getPassword(),
            'roles' => $user->getRoles(),
            'image' => $user->getImage(),
            'theme' => $user->getTheme(),
        );

        $portfolio = $user->getPortfolio();

        // Agregar los datos del portfolio directamente
        $userJSON['portfolio'] = [
            'id' => $portfolio->getId(),
            'description' => $portfolio->getDescription(),
            'position' => $portfolio->getPosition(),
            'stack' => $portfolio->getStack(),
        ];
        
            // Obtener la educación asociada al portafolio
        $educations = $portfolio->getEducation(); 

        // Inicializar el array de educación
        $userJSON['portfolio']['education'] = [];

        // Agregar cada educación al array
        foreach ($educations as $education) {
            $userJSON['portfolio']['education'][] = [
                'id' => $education->getId(),
                'title' => $education->getTitle(),
                'date' => $education->getDate(),
            ];
        }

        // Obtener la experience asociada al portafolio
        $experiences = $portfolio->getExperience(); 

        // Inicializar el array de experience
        $userJSON['portfolio']['experience'] = [];

        // Agregar cada experience al array
        foreach ($experiences as $experience) {
            $userJSON['portfolio']['experience'][] = [
                'id' => $experience->getId(),
                'title' => $experience->getTitle(),
                'date' => $experience->getDate(),
                'company' => $experience->getCompany(),
                'page' => $experience->getPage(),
            ];
        }

        // Obtener los projects asociada al portafolio
        $projects = $portfolio->getProject(); 

        // Inicializar el array de project
        $userJSON['portfolio']['project'] = [];

        // Agregar cada project al array
        foreach ($projects as $project) {
            $userJSON['portfolio']['project'][] = [
                'id' => $project->getId(),
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
                'demo' => $project->getDemo(),
                'github' => $project->getGithub(),
                'image' => $project->getImage(),
            ];
        }

        return $userJSON;
    }

    public function portfolios($portfolio): array
    {
        $portfolioJSON=[];

        $portfolioJSON = array (
            'id' => $portfolio->getId(),
            'description' => $portfolio->getDescription(),
            'position' => $portfolio->getPosition(),
            'stack' => $portfolio->getStack(),
        );

        return $portfolioJSON;
    }

    public function educations($education): array
    {
        $educationJSON=[];

        $educationJSON = array (
            'id' => $education->getId(),
            'title' => $education->getTitle(),
            'date' => $education->getDate(),
        );

        return $educationJSON;
    }

    public function experiences($experience): array
    {
        $experienceJSON=[];

        $experienceJSON = array (
            'id' => $experience->getId(),
            'title' => $experience->getTitle(),
            'date' => $experience->getDate(),
        );

        return $experienceJSON;
    }

    public function projects($project): array
    {
        $projectJSON=[];

        $projectJSON = array (
            'id' => $project->getId(),
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'demo' => $project->getDemo(),
            'github' => $project->getGithub(),
            'image' => $project->getImage(),
        );

        return $projectJSON;
    }

}