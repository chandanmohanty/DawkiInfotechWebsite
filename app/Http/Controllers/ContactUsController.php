<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class ContactUsController extends Controller
{
    /**
     * Persist a contact form submission.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:120'],
            'email'     => ['required', 'email', 'max:191'],
            'phone'     => ['nullable', 'string', 'max:32'],
            'help_type' => ['nullable', Rule::in(['team', 'software', 'design', 'marketing', 'others'])],
            'message'   => ['required', 'string', 'max:5000'],
        ]);

        ContactUs::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'phone'      => $data['phone']     ?? null,
            'help_type'  => $data['help_type'] ?? null,
            'message'    => $data['message'],
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
        ]);

        return back()->with('success', 'Thanks — your message has been received. We\'ll get back to you within 24 hours.');
    }
}
