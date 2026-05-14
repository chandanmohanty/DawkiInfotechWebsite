<?php

use App\Http\Controllers\Panel\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/faq', function () {
    return Inertia::render('FAQ');
})->name('faq');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');
Route::post('/contact', [\App\Http\Controllers\ContactUsController::class, 'store'])->name('contact.store');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
})->name('portfolio');

Route::get('/estimate', function () {
    return Inertia::render('Estimate');
})->name('estimate');

// Services Routes
Route::prefix('services')->group(function () {
    // Software Engineering
    Route::get('/software-engineering/custom-software-development', function () {
        return Inertia::render('Services/SoftwareEngineering/CustomSoftwareDevelopment');
    });
    Route::get('/software-engineering/web-application-development', function () {
        return Inertia::render('Services/SoftwareEngineering/WebApplicationDevelopment');
    });
    Route::get('/software-engineering/mobile-app-development', function () {
        return Inertia::render('Services/SoftwareEngineering/MobileAppDevelopment');
    });
    Route::get('/software-engineering/enterprise-app-development', function () {
        return Inertia::render('Services/SoftwareEngineering/EnterpriseAppDevelopment');
    });
    Route::get('/software-engineering/blockchain-development', function () {
        return Inertia::render('Services/SoftwareEngineering/BlockChainDevelopment');
    });
    Route::get('/software-engineering/cloud-services', function () {
        return Inertia::render('Services/SoftwareEngineering/CloudServices');
    });
    Route::get('/software-engineering/devops-services', function () {
        return Inertia::render('Services/SoftwareEngineering/DevOpsServices');
    });
    Route::get('/software-engineering/saas-application', function () {
        return Inertia::render('Services/SoftwareEngineering/SaaSApplication');
    });
    Route::get('/software-engineering/product-ui-ux-design', function () {
        return Inertia::render('Services/SoftwareEngineering/ProductUiUxDesign');
    });

    // Digital Marketing
    Route::get('/digital-marketing/marketing-strategy', function () {
        return Inertia::render('Services/DigitalMarketing/MarketingStrategy');
    });
    Route::get('/digital-marketing/search-engine-optimization', function () {
        return Inertia::render('Services/DigitalMarketing/SearchEngineOptimization');
    });
    Route::get('/digital-marketing/paid-ad-campaigns', function () {
        return Inertia::render('Services/DigitalMarketing/PaidAdCampaigns');
    });
    Route::get('/digital-marketing/social-media-management', function () {
        return Inertia::render('Services/DigitalMarketing/SocialMediaManagement');
    });

    // AI & Data Engineering
    Route::get('/ai-data/ai-strategy-consulting', function () {
        return Inertia::render('Services/AIAndDataEngineering/AiStrategyConsulting');
    });
    Route::get('/ai-data/ai-agent-development', function () {
        return Inertia::render('Services/AIAndDataEngineering/AiAgentDevelopment');
    });
    Route::get('/ai-data/salesforce-development', function () {
        return Inertia::render('Services/AIAndDataEngineering/SalesforceDevelopment');
    });
    Route::get('/ai-data/business-intelligence-services', function () {
        return Inertia::render('Services/AIAndDataEngineering/BusinessIntelligenceServices');
    });

    // Team Extension Services
    Route::get('/team-extension/it-consulting-services', function () {
        return Inertia::render('Services/TeamExtensionServices/ItConsultingServices');
    });
    Route::get('/team-extension/automated-testing-services', function () {
        return Inertia::render('Services/TeamExtensionServices/AutomatedTestingServices');
    });
    Route::get('/team-extension/performance-testing-services', function () {
        return Inertia::render('Services/TeamExtensionServices/PerformanceTestingServices');
    });
    Route::get('/team-extension/security-testing-services', function () {
        return Inertia::render('Services/TeamExtensionServices/SecurityTestingServices');
    });
    Route::get('/team-extension/metaverse-development', function () {
        return Inertia::render('Services/TeamExtensionServices/MetaverseDevelopment');
    });

    // Other Services
    Route::get('/other/dedicated-development-teams', function () {
        return Inertia::render('Services/OtherServices/DedicatedDevelopmentTeams');
    });
    Route::get('/other/offshore-development-center', function () {
        return Inertia::render('Services/OtherServices/OffshoreDevelopmentCenter');
    });
    Route::get('/other/staff-augmentation-services', function () {
        return Inertia::render('Services/OtherServices/StaffAugmentationServices');
    });

    // Industries
    Route::get('/industries/healthcare-apps', function () {
        return Inertia::render('Industries/HealthcareApps');
    });
    Route::get('/industries/elearning-solutions', function () {
        return Inertia::render('Industries/ELearningSolutions');
    });
    Route::get('/industries/hotels-restaurants', function () {
        return Inertia::render('Industries/HotelsAndRestaurants');
    });
    Route::get('/industries/real-estate', function () {
        return Inertia::render('Industries/RealEstateManagement');
    });
    Route::get('/industries/performance-management', function () {
        return Inertia::render('Industries/PerformanceManagement');
    });
    Route::get('/industries/financial-apps', function () {
        return Inertia::render('Industries/FinancialApps');
    });
});

// Panel Routes
Route::prefix('panel')->group(function () {
    // Auth routes (accessible without authentication)
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('panel.login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('panel.register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('panel.logout');

    // Protected routes (require authentication)
    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Panel/Dashboard');
        })->name('panel.dashboard');

        // Site Settings (GTM, etc.)
        Route::get('/settings', [\App\Http\Controllers\Panel\SettingsController::class, 'index'])->name('panel.settings.index');
        Route::put('/settings', [\App\Http\Controllers\Panel\SettingsController::class, 'update'])->name('panel.settings.update');
        Route::post('/settings/verify-gtm', [\App\Http\Controllers\Panel\SettingsController::class, 'verify'])->name('panel.settings.verify-gtm');
        Route::post('/settings/test-crm', [\App\Http\Controllers\Panel\SettingsController::class, 'testCrm'])->name('panel.settings.test-crm');

        // Blog Management Routes
        Route::prefix('blog')->name('panel.blog.')->group(function () {
            // Posts
            Route::resource('posts', \App\Http\Controllers\Panel\Blog\PostController::class);
            
            // Categories
            Route::resource('categories', \App\Http\Controllers\Panel\Blog\CategoryController::class)->except(['show', 'create', 'edit']);
            
            // Tags
            Route::resource('tags', \App\Http\Controllers\Panel\Blog\TagController::class)->except(['show', 'create', 'edit']);
            
            // Image Upload
            Route::post('upload-image', [\App\Http\Controllers\Panel\Blog\ImageUploadController::class, 'upload'])->name('upload-image');
        });
    });
});

// Frontend Blog Routes — backed by the real posts DB table.
Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');
