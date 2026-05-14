<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use App\Services\LeadForwarder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class ContactUsController extends Controller
{
    /**
     * Persist a contact form submission and forward it to the CRM.
     *
     * Dual-write order is intentional: save locally FIRST so we always have
     * the lead even if the CRM is unreachable; then attempt the forward.
     * The forwarder is fail-safe — a CRM outage won't break the visitor
     * experience.
     */
    public function store(Request $request, LeadForwarder $forwarder): RedirectResponse
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

        $forwarder->send([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone']     ?? null,
            'help_type' => $data['help_type'] ?? null,
            'message'   => $data['message'],
        ], [
            'form'    => 'contact',
            'page'    => $request->header('referer'),
            'ip'      => $request->ip(),
        ]);

        return back()->with('success', 'Thanks — your message has been received. We\'ll get back to you within 24 hours.');
    }
}
